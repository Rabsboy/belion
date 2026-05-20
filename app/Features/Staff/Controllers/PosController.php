<?php

namespace App\Features\Staff\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Menu\Models\Product;
use App\Features\Orders\Models\Order;
use App\Features\Orders\Models\OrderItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    public function create()
    {
        $products = Product::with('category')
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'image' => $p->images_name,
                'category' => $p->category?->name,
                'variations' => $p->variations,
                'options' => $p->options,
            ]);

        return Inertia::render('Staff/POS', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1|max:99',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.line_total' => 'required|numeric|min:0',
            'items.*.selected_variation' => 'nullable|string',
            'items.*.selected_options' => 'nullable|array',
            'total' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => null,
                'client_name' => $validated['customer_name'],
                'client_phone' => $validated['customer_phone'],
                'client_email' => null,
                'subtotal' => $validated['total'],
                'delivery_fee' => 0,
                'discount_amount' => 0,
                'total' => $validated['total'],
                'address' => 'POS',
                'order_source' => 'pos',
                'order_type' => 'pos',
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => 'cash',
            ]);

            foreach ($validated['items'] as $item) {
                $selectedOptions = [];

                if (!empty($item['selected_variation'])) {
                    $selectedOptions['variation'] = ['name' => $item['selected_variation']];
                }

                if (!empty($item['selected_options'])) {
                    $selectedOptions['options'] = $item['selected_options'];
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $item['line_total'],
                    'selected_options' => !empty($selectedOptions) ? $selectedOptions : null,
                ]);
            }

            DB::commit();

            $receiptUrl = route('staff.pos.receipt', $order->id);

            return redirect()->route('staff.pos.create')
                ->with('success', "POS order #{$order->id} completed successfully.")
                ->with('receipt_url', $receiptUrl);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create POS order: ' . $e->getMessage()]);
        }
    }

    public function receipt(Order $order)
    {
        if ($order->order_source !== 'pos') {
            abort(404, 'Not a POS order.');
        }

        $order->load('items');

        $pdf = Pdf::loadView('receipt', ['order' => $order])
            ->setPaper([0, 0, 226, 600], 'portrait');

        return $pdf->stream("receipt-{$order->id}.pdf");
    }
}
