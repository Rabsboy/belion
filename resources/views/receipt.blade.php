<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt #{{ $order->id }}</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            width: 80mm;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #333;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0 0 4px;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0;
            font-size: 11px;
        }
        .divider {
            border-top: 1px dashed #333;
            margin: 8px 0;
        }
        .info {
            margin-bottom: 8px;
        }
        .info p {
            margin: 2px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 3px 0;
            text-align: left;
        }
        th {
            border-bottom: 1px dashed #333;
        }
        .price {
            text-align: right;
        }
        .qty {
            text-align: center;
        }
        .totals {
            margin-top: 5px;
        }
        .totals td {
            padding: 2px 0;
        }
        .totals .label {
            text-align: right;
            font-weight: bold;
        }
        .totals .value {
            text-align: right;
            width: 30%;
        }
        .grand-total {
            font-size: 14px;
            font-weight: bold;
            border-top: 1px dashed #333;
            padding-top: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px dashed #333;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }}</h1>
        <p>Point of Sale Receipt</p>
    </div>

    <div class="info">
        <p><strong>Order #:</strong> {{ $order->id }}</p>
        <p><strong>Date:</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
        <p><strong>Customer:</strong> {{ $order->client_name }}</p>
        <p><strong>Phone:</strong> {{ $order->client_phone }}</p>
        <p><strong>Payment:</strong> {{ ucfirst($order->payment_method ?? 'cash') }}</p>
    </div>

    <div class="divider"></div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td class="qty">{{ $item->quantity }}</td>
                <td class="price">{{ formatRupiah($item->line_total) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="divider"></div>

    <table class="totals">
        <tr>
            <td class="label">Subtotal</td>
            <td class="value">{{ formatRupiah($order->subtotal) }}</td>
        </tr>
        @if ((float) $order->delivery_fee > 0)
        <tr>
            <td class="label">Delivery Fee</td>
            <td class="value">{{ formatRupiah($order->delivery_fee) }}</td>
        </tr>
        @endif
        @if ((float) $order->discount_amount > 0)
        <tr>
            <td class="label">Discount</td>
            <td class="value">-{{ formatRupiah($order->discount_amount) }}</td>
        </tr>
        @endif
        <tr class="grand-total">
            <td class="label">TOTAL</td>
            <td class="value">{{ formatRupiah($order->total) }}</td>
        </tr>
    </table>

    <div class="footer">
        <p>Thank you for your order!</p>
        <p>{{ date('Y') }} {{ config('app.name') }}</p>
    </div>
</body>
</html>
