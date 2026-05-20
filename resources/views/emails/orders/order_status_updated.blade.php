<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ea580c; color: white; padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { background-color: #ffffff; padding: 40px 30px; border: 1px solid #f3f4f6; border-radius: 0 0 20px 20px; }
        .section-title { font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
        .status-update { background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .status-title { font-weight: bold; color: #ea580c; font-size: 18px; margin-bottom: 5px; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .item-info { flex: 1; }
        .item-name { font-weight: bold; color: #111827; }
        .item-details { font-size: 12px; color: #6b7280; }
        .item-price { font-weight: bold; color: #111827; margin-left: 20px; }
        .summary { background-color: #f9fafb; padding: 20px; border-radius: 15px; margin-top: 30px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb; font-size: 20px; font-weight: 800; color: #ea580c; }
        .footer { text-align: center; padding: 30px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Update</h1>
            <p>Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
        <div class="content">
            <p>Hi {{ $order->client_name ?? $order->user->name ?? 'Customer' }},</p>
            
            <div class="status-update">
                <div class="status-title">Status: {{ ucfirst(str_replace('_', ' ', $order->status)) }}</div>
                <p style="margin: 0; color: #4b5563;">
                    Your order status has been updated.
                    @if($order->status === 'out_for_delivery')
                        Get ready! Your delicious food is on its way.
                    @elseif($order->status === 'delivered')
                        Enjoy your meal! Thank you for ordering with us.
                    @elseif($order->status === 'picked')
                        Your order has been picked up. Enjoy!
                    @elseif($order->status === 'preparing')
                        We are preparing your order with care.
                    @elseif($order->status === 'cancelled')
                        Your order has been cancelled. If this is a mistake, please contact us.
                    @endif
                </p>
            </div>

            <div class="section-title">Order Details</div>
            
            @foreach($order->items as $item)
            <div class="item-row">
                <div class="item-info">
                    <div class="item-name">{{ $item->quantity }}x {{ $item->product_name }}</div>
                    @if(isset($item->selected_options['variation']))
                        <div class="item-details">Size: {{ $item->selected_options['variation']['name'] }}</div>
                    @endif
                    @if(isset($item->selected_options['options']) && count($item->selected_options['options']) > 0)
                        <div class="item-details">
                            Extras: {{ collect($item->selected_options['options'])->pluck('name')->implode(', ') }}
                        </div>
                    @endif
                </div>
                <div class="item-price">{{ formatRupiah($item->line_total) }}</div>
            </div>
            @endforeach

            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>{{ formatRupiah($order->subtotal) }}</span>
                </div>
                <div class="summary-row">
                    <span>Delivery Fee</span>
                    <span>{{ formatRupiah($order->delivery_fee) }}</span>
                </div>
                @if($order->discount_amount > 0)
                <div class="summary-row" style="color: #16a34a; font-weight: bold;">
                    <span>Discount</span>
                    <span>-{{ formatRupiah($order->discount_amount) }}</span>
                </div>
                @endif
                <div class="total-row">
                    <span>Total Paid</span>
                    <span>{{ formatRupiah($order->total) }}</span>
                </div>
            </div>

            <div class="section-title" style="margin-top: 30px;">Delivery Address</div>
            <p style="color: #4b5563;">
                {{ $order->address }}<br>
                <strong>Phone:</strong> {{ $order->client_phone ?? $order->user->phone ?? 'N/A' }}
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Food Delivery System. All rights reserved.<br>
            If you have any questions, please contact our support.
        </div>
    </div>
</body>
</html>
