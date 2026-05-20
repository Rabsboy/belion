<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Orders\Models\Order;
use App\Features\Orders\Models\OrderItem;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        $day = $request->input('day');
        $date = $request->input('date');
        $endDate = $request->input('end_date');

        // Query Base
        $orderQuery = Order::where('payment_status', 'paid');

        if ($year !== 'lifetime') {
            $orderQuery->whereYear('created_at', $year);
            if ($month !== 'all') {
                $orderQuery->whereMonth('created_at', $month);
                if ($day && $day !== 'all') {
                    $orderQuery->whereDay('created_at', $day);
                }
            }
        }

        // Date range filter (override year/month/day)
        if ($date) {
            $orderQuery->whereDate('created_at', '>=', $date);
            if ($endDate) {
                $orderQuery->whereDate('created_at', '<=', $endDate);
            } else {
                $orderQuery->whereDate('created_at', '<=', $date);
            }
        }

        // Summary Stats
        $stats = [
            'total_revenue' => $orderQuery->sum('total'),
            'total_orders' => $orderQuery->count(),
            'avg_order_value' => $orderQuery->avg('total') ?: 0,
        ];

        // Best Selling Products
        $bestSellingProducts = OrderItem::with('product')
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(line_total) as total_revenue'))
            ->whereHas('order', function ($query) use ($year, $month, $day, $date, $endDate) {
                $query->where('payment_status', 'paid');
                if ($year !== 'lifetime') {
                    $query->whereYear('created_at', $year);
                    if ($month !== 'all') {
                        $query->whereMonth('created_at', $month);
                        if ($day && $day !== 'all') {
                            $query->whereDay('created_at', $day);
                        }
                    }
                }
                if ($date) {
                    $query->whereDate('created_at', '>=', $date);
                    if ($endDate) {
                        $query->whereDate('created_at', '<=', $endDate);
                    } else {
                        $query->whereDate('created_at', '<=', $date);
                    }
                }
            })
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        // Revenue by Day/Month/Year
        $revenueData = Order::where('payment_status', 'paid');

        if ($date) {
            $revenueData->whereDate('created_at', '>=', $date);
            if ($endDate) {
                $revenueData->whereDate('created_at', '<=', $endDate);
            } else {
                $revenueData->whereDate('created_at', '<=', $date);
            }
            $groupBy = DB::raw('DATE(created_at)');
            $select = [DB::raw('DATE(created_at) as label'), DB::raw('SUM(total) as value')];
        } elseif ($year === 'lifetime') {
            $groupBy = DB::raw('YEAR(created_at)');
            $select = [DB::raw('YEAR(created_at) as label'), DB::raw('SUM(total) as value')];
        } elseif ($month !== 'all') {
            $revenueData->whereYear('created_at', $year)->whereMonth('created_at', $month);
            $groupBy = DB::raw('DAY(created_at)');
            $select = [DB::raw('DAY(created_at) as label'), DB::raw('SUM(total) as value')];
        } else {
            $revenueData->whereYear('created_at', $year);
            $groupBy = DB::raw('MONTH(created_at)');
            $select = [DB::raw('MONTH(created_at) as label'), DB::raw('SUM(total) as value')];
        }

        $chartData = $revenueData->select($select)
            ->groupBy($groupBy)
            ->orderBy('label')
            ->get();

        // All orders list for export
        $orders = $orderQuery->clone()
            ->with(['items.product'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Reports', [
            'stats' => $stats,
            'bestSellingProducts' => $bestSellingProducts,
            'chartData' => $chartData,
            'orders' => $orders,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'day' => $day,
                'date' => $date,
                'end_date' => $endDate,
            ],
            'availableYears' => collect(array_merge(
                Order::selectRaw('YEAR(created_at) as year')->distinct()->pluck('year')->toArray(),
                [2025, 2026, 2027]
            ))->unique()->sortDesc()->values()->all(),
        ]);
    }

    public function export(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('m'));
        $day = $request->input('day');
        $date = $request->input('date');
        $endDate = $request->input('end_date');

        $orderQuery = Order::where('payment_status', 'paid');

        if ($year !== 'lifetime') {
            $orderQuery->whereYear('created_at', $year);
            if ($month !== 'all') {
                $orderQuery->whereMonth('created_at', $month);
                if ($day && $day !== 'all') {
                    $orderQuery->whereDay('created_at', $day);
                }
            }
        }

        if ($date) {
            $orderQuery->whereDate('created_at', '>=', $date);
            if ($endDate) {
                $orderQuery->whereDate('created_at', '<=', $endDate);
            } else {
                $orderQuery->whereDate('created_at', '<=', $date);
            }
        }

        $orders = $orderQuery->with(['items.product', 'payment'])->latest()->get();

        $filename = 'report-' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($orders) {
            $output = fopen('php://output', 'w');

            // BOM for Excel UTF-8
            fwrite($output, "\xEF\xBB\xBF");

            // Header row
            fputcsv($output, [
                'Order ID',
                'Date',
                'Customer',
                'Email',
                'Phone',
                'Items',
                'Subtotal',
                'Delivery Fee',
                'Discount',
                'Total',
                'Payment Method',
                'Payment Status',
                'Order Status',
                'Transaction ID',
            ]);

            foreach ($orders as $order) {
                $items = $order->items->map(fn ($i) => $i->product_name . ' x' . $i->quantity)->implode(', ');
                fputcsv($output, [
                    $order->id,
                    $order->created_at->format('Y-m-d H:i'),
                    $order->client_name,
                    $order->client_email,
                    $order->client_phone,
                    $items,
                    $order->subtotal,
                    $order->delivery_fee,
                    $order->discount_amount,
                    $order->total,
                    $order->payment_method,
                    $order->payment_status,
                    $order->status,
                    $order->payment?->transaction_id ?? '',
                ]);
            }

            fclose($output);
        };

        return response()->stream($callback, 200, $headers);
    }
}
