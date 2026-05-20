<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #8b5cf6; color: white; padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { background-color: #ffffff; padding: 40px 30px; border: 1px solid #f3f4f6; border-radius: 0 0 20px 20px; }
        .section-title { font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
        .status-badge { display: inline-block; background-color: #f5f3ff; color: #8b5cf6; font-weight: bold; padding: 10px 20px; border-radius: 30px; margin-bottom: 20px; border: 1px solid #ddd6fe; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .item-info { flex: 1; }
        .item-name { font-weight: bold; color: #111827; }
        .item-price { font-weight: bold; color: #111827; margin-left: 20px; }
        .summary { background-color: #f9fafb; padding: 20px; border-radius: 15px; margin-top: 30px; }
        .total-row { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb; font-size: 20px; font-weight: 800; color: #8b5cf6; }
        .footer { text-align: center; padding: 30px; font-size: 12px; color: #9ca3af; }
        .btn { display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛵 On Its Way!</h1>
            <p>Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
        <div class="content">
            <p>Hi {{ $order->client_name ?? $order->user->name ?? 'Customer' }},</p>
            
            <div style="text-align: center;">
                <div class="status-badge">Status: OUT FOR DELIVERY</div>
                <p style="color: #4b5563; font-size: 16px;">
                    Your food is out for delivery! Our rider is navigating the streets to bring your meal to your doorstep as fast as possible.
                </p>
                @if($order->delivery_tracking_url)
                    <a href="{{ $order->delivery_tracking_url }}" class="btn">Track Order</a>
                @endif
            </div>

            <div class="section-title" style="margin-top: 30px;">Order Details</div>
            
            @foreach($order->items as $item)
            <div class="item-row">
                <div class="item-info">
                    <div class="item-name">{{ $item->quantity }}x {{ $item->product_name }}</div>
                </div>
                <div class="item-price">{{ formatRupiah($item->line_total) }}</div>
            </div>
            @endforeach

            <div class="summary">
                <div class="total-row">
                    @if($order->payment_status === 'paid')
                        <span>Total Paid</span>
                    @else
                        <span>Amount Due</span>
                    @endif
                    <span>{{ formatRupiah($order->total) }}</span>
                </div>
            </div>

            <div class="section-title" style="margin-top: 30px;">Delivery To</div>
            <p style="color: #4b5563;">
                {{ $order->address }}
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Food Delivery System. All rights reserved.<br>
            Hot & Fresh, just for you!
        </div>
    </div>
</body>
</html>
