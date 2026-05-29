<?php

namespace App\Features\Orders\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Coupon;
use App\Features\Orders\Models\Order;
use App\Features\Orders\Models\OrderItem;
use App\Features\Orders\Models\Payment;
use App\Features\Menu\Models\Product;
use App\Services\DeliveryFeeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $storeOpen = \App\Features\Admin\Models\Setting::where('key', 'store_open')->value('value');
        if ($storeOpen === '0') {
            return redirect()->route('menu')->with('error', 'Maaf, toko sedang tutup. Silakan coba lagi nanti.');
        }

        return Inertia::render('Orders/Checkout');
    }

    public function success(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product', 'coupon', 'payment']);
        return Inertia::render('Orders/Success', [
            'order' => $order,
        ]);
    }

    public function cancel(Order $order = null)
    {
        if ($order && $order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Orders/Cancel', [
            'order' => $order,
        ]);
    }

    public function searchAddress(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|min:2',
        ]);

        try {
            $deliveryFeeService = app(DeliveryFeeService::class);
            $results = $deliveryFeeService->searchAddress($validated['query']);

            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json([], 422);
        }
    }

    public function calculateFeeFromCoordinates(Request $request)
    {
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        try {
            $deliveryFeeService = app(DeliveryFeeService::class);

            $displayName = $deliveryFeeService->reverseGeocode($validated['lat'], $validated['lng']);

            $result = $deliveryFeeService->calculateFeeFromCoordinates(
                $validated['lat'],
                $validated['lng'],
                $displayName
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => ['required', 'string',],
            'address' => 'nullable|string',
            'email' => 'nullable|email',
            'note' => 'required_if:fulfillment_type,delivery|nullable|string',
            'fulfillment_type' => 'required|in:delivery,pickup',
            'payment_method' => 'required|in:midtrans',
            'delivery_lat' => 'required_if:fulfillment_type,delivery|nullable|numeric|between:-90,90',
            'delivery_lng' => 'required_if:fulfillment_type,delivery|nullable|numeric|between:-180,180',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1|max:10',
            'items.*.price' => 'required|numeric',
            'items.*.selected_variation' => 'nullable|array',
            'items.*.selected_options' => 'nullable|array',
            'total' => 'required|numeric',
            'coupon_id' => 'nullable|integer',
            'discount' => 'nullable|numeric',
        ]);

        $user = Auth::user();

        if ($user && $user->is_banned) {
            Log::warning("Banned user {$user->id} attempted to place order");
            return response()->json([
                'message' => 'Your account has been suspended. Please contact support for assistance.',
            ], 403);
        }

        $storeOpen = \App\Features\Admin\Models\Setting::where('key', 'store_open')->value('value');
        if ($storeOpen === '0') {
            Log::warning('Order placement blocked - store is closed');
            return response()->json([
                'message' => 'Maaf, toko sedang tutup. Silakan coba lagi nanti.',
            ], 503);
        }

        DB::beginTransaction();
        try {

            // Validate prices against database
            $calculatedSubtotal = 0;
            $validatedItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Product ID {$item['product_id']} not found.");
                }

                $expectedPrice = (float) $product->price;

                // Apply variation price if selected
                if (isset($item['selected_variation']) && $item['selected_variation']) {
                    $variationName = $item['selected_variation']['name'] ?? null;
                    $variation = collect($product->variations ?? [])
                        ->firstWhere('name', $variationName);

                    if ($variation) {
                        $expectedPrice = (float) $variation['price'];
                    } else {
                        Log::warning("Variation '{$variationName}' not found for product {$product->id}");
                    }
                }

                // Calculate options total
                $optionsTotalPrice = 0;
                if (isset($item['selected_options']) && is_array($item['selected_options'])) {
                    foreach ($item['selected_options'] as $selectedOption) {
                        $optionName = $selectedOption['name'] ?? null;
                        $optionQuantity = $selectedOption['quantity'] ?? 1;

                        $productOption = collect($product->options ?? [])
                            ->firstWhere('name', $optionName);

                        if ($productOption) {
                            $optionsTotalPrice += (float) $productOption['price'] * $optionQuantity;
                        }
                    }
                }

                $expectedPrice += $optionsTotalPrice;

                // Verify price matches (0.01 tolerance)
                $clientPrice = (float) $item['price'];
                if (abs($expectedPrice - $clientPrice) > 0.01) {
                    Log::error("Price mismatch for product {$product->id}: Expected {$expectedPrice}, Got {$clientPrice}");
                    throw new \Exception('Price validation failed. Please refresh and try again.');
                }

                $lineTotal = $expectedPrice * $item['quantity'];
                $calculatedSubtotal += $lineTotal;

                $validatedItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $expectedPrice,
                    'line_total' => $lineTotal,
                    'selected_options' => [
                        'variation' => $item['selected_variation'] ?? null,
                        'options' => $item['selected_options'] ?? [],
                    ],
                ];
            }

            $discount = 0;

            $deliveryFeeService = app(DeliveryFeeService::class);
            $deliveryFee = 0;
            $deliveryLat = null;
            $deliveryLng = null;
            $deliveryDistance = null;
            $deliveryAddress = null;

            if ($validated['fulfillment_type'] === 'delivery') {
                $feeResult = $deliveryFeeService->calculateFeeFromCoordinates(
                    $validated['delivery_lat'],
                    $validated['delivery_lng']
                );

                if (!$feeResult['within_range']) {
                    throw new \Exception($feeResult['error']);
                }

                $deliveryFee = $feeResult['delivery_fee'];
                $deliveryLat = $feeResult['lat'];
                $deliveryLng = $feeResult['lng'];
                $deliveryDistance = $feeResult['distance_km'];
                $deliveryAddress = $feeResult['display_name'] ?? $validated['address'];
            }

            // Validate coupon server-side
            if ($validated['coupon_id']) {
                $coupon = Coupon::find($validated['coupon_id']);

                if (!$coupon) {
                    throw new \Exception('Invalid coupon. Please refresh and try again.');
                }

                if (!$coupon->isValidFor($calculatedSubtotal, $user)) {
                    $message = 'This coupon is not valid for your order.';

                    if ($calculatedSubtotal < $coupon->min_order) {
                        $message = "Minimum order amount for this coupon is " . formatRupiah($coupon->min_order) . ".";
                    } elseif (!$coupon->is_active) {
                        $message = 'This coupon is no longer active.';
                    } elseif ($coupon->end_at && $coupon->end_at->isPast()) {
                        $message = 'This coupon has expired.';
                    } elseif ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                        $message = 'This coupon has reached its usage limit.';
                    } elseif ($coupon->per_user_limit !== null && $user) {
                        $userUsageCount = Order::where('user_id', $user->id)
                            ->where('coupon_id', $coupon->id)
                            ->count();
                        if ($userUsageCount >= $coupon->per_user_limit) {
                            $message = 'You have already reached the usage limit for this coupon.';
                        }
                    }

                    throw new \Exception($message);
                }

                $calculatedDiscount = $coupon->calculateDiscount($calculatedSubtotal);

                $clientDiscount = (float) ($validated['discount'] ?? 0);
                if (abs($calculatedDiscount - $clientDiscount) > 0.01) {
                    Log::error("Discount mismatch: Expected {$calculatedDiscount}, Got {$clientDiscount}");
                    throw new \Exception('Coupon discount validation failed. Please refresh and try again.');
                }

                $discount = $calculatedDiscount;
            } else {
                if (isset($validated['discount']) && $validated['discount'] > 0) {
                    Log::error('Client sent discount without coupon');
                    throw new \Exception('Invalid discount applied. Please refresh and try again.');
                }
            }

            $calculatedTotal = $calculatedSubtotal + $deliveryFee - $discount;

            $clientTotal = (float) $validated['total'];
            if (abs($calculatedTotal - $clientTotal) > 0.10) {
                Log::error("Total mismatch: Calculated {$calculatedTotal}, Got {$clientTotal}");
                throw new \Exception('Order total validation failed. Please refresh and try again.');
            }

            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'client_name' => $validated['name'],
                'client_email' => $validated['email'] ?? ($user ? $user->email : null),
                'client_phone' => $validated['phone'],
                'coupon_id' => $validated['coupon_id'] ?? null,
                'subtotal' => $calculatedSubtotal,
                'total' => $calculatedTotal,
                'discount_amount' => $discount,
                'delivery_fee' => $deliveryFee,
                'delivery_lat' => $deliveryLat,
                'delivery_lng' => $deliveryLng,
                'delivery_distance_km' => $deliveryDistance,
                'delivery_address' => $deliveryAddress,
                'address' => $validated['fulfillment_type'] === 'pickup' ? null : $validated['address'],
                'order_note' => $validated['note'],
                'order_type' => 'home-delivery',
                'fulfillment_type' => $validated['fulfillment_type'],
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
            ]);

            if ($order->coupon_id) {
                Coupon::where('id', $order->coupon_id)->increment('used_count');
            }

            foreach ($validatedItems as $validatedItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $validatedItem['product']->id,
                    'product_name' => $validatedItem['product']->name,
                    'quantity' => $validatedItem['quantity'],
                    'unit_price' => $validatedItem['unit_price'],
                    'line_total' => $validatedItem['line_total'],
                    'selected_options' => $validatedItem['selected_options'],
                ]);
            }

            $tran_id = 'MIDTRANS_ORD-' . $order->id . '-' . uniqid();

            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $validated['total'],
                'status' => 'pending',
                'transaction_id' => $tran_id,
            ]);

            DB::commit();

            // Midtrans init
            $midtransResult = $this->initiateMidtrans($order, $tran_id, $validated['total']);
            $midtransResult['order_id'] = $order->id;
            $midtransResult['snap_js_url'] = env('MIDTRANS_IS_SANDBOX', true)
                ? 'https://app.sandbox.midtrans.com/snap/snap.js'
                : 'https://app.midtrans.com/snap/snap.js';
            return response()->json($midtransResult);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order placement failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Order placement failed: ' . $e->getMessage(),
            ], 422);
        }
    }

    public function status(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return response()->json([
            'payment_status' => $order->payment_status,
        ]);
    }

    public function repay(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return back()->with('error', 'Repayment is not configured for Midtrans in this build.');
    }

    private function initiateMidtrans(Order $order, string $tran_id, $amount)
    {
        $serverKey = env('MIDTRANS_SERVER_KEY');
        $isSandbox = env('MIDTRANS_IS_SANDBOX', true);

        if (!$serverKey) {
            throw new \Exception('MIDTRANS_SERVER_KEY is not set in .env');
        }

        // Endpoint for Snap token creation
        $url = $isSandbox ? 'https://app.sandbox.midtrans.com/snap/v1/transactions' : 'https://app.midtrans.com/snap/v1/transactions';

        if (!$order->relationLoaded('items')) {
            $order->load('items');
        }

        $grossAmount = (int) $amount;

        $itemDetails = $order->items->map(function ($item) {
            return [
                'id' => (string) $item->product_id,
                'price' => (int) $item->unit_price,
                'quantity' => (int) $item->quantity,
                'name' => (string) $item->product_name,
            ];
        })->values()->all();

        if ((int) $order->delivery_fee > 0) {
            $itemDetails[] = [
                'id' => 'delivery_fee',
                'price' => (int) $order->delivery_fee,
                'quantity' => 1,
                'name' => 'Delivery Fee',
            ];
        }

        if ((int) $order->discount_amount > 0) {
            $itemDetails[] = [
                'id' => 'discount',
                'price' => -(int) $order->discount_amount,
                'quantity' => 1,
                'name' => 'Discount',
            ];
        }

        $payload = [
            'transaction_details' => [
                'order_id' => $tran_id,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $order->client_name ?? ($order->user?->name ?? 'Customer'),
                'email' => $order->client_email ?? ($order->user?->email ?? 'customer@example.com'),
                'phone' => $order->client_phone ?? ($order->user?->phone ?? ''),
            ],
            'item_details' => $itemDetails,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Basic ' . base64_encode($serverKey . ':'),
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

        $response = curl_exec($ch);
        $error = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            throw new \Exception('Midtrans cURL error: ' . $error);
        }

        $data = json_decode($response, true);
        if ($httpCode < 200 || $httpCode >= 300) {
            throw new \Exception('Midtrans init failed: ' . ($data['message'] ?? $response));
        }

        $token = $data['token'] ?? null;
        if (!$token) {
            throw new \Exception('Midtrans token not found in response');
        }

        $snapUrl = route('payment.midtrans.snap', ['token' => $token]);
        return [
            'token' => $token,
            'redirect_url' => $snapUrl,
        ];
    }
}

