<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #111827; color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #f3f4f6; border-radius: 0 0 10px 10px; }
        .status-box { background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .section-title { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3>Admin Notification: Status Updated</h3>
        </div>
        <div class="content">
            <div class="status-box">
                <strong style="color: #10b981; font-size: 18px;">DELIVERED</strong><br>
                Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }} has been marked as delivered.
            </div>

            <div class="section-title">Final Summary</div>
            <p>
                <strong>Customer:</strong> {{ $order->client_name ?? 'N/A' }}<br>
                <strong>Total Received:</strong> {{ formatRupiah($order->total) }}<br>
                <strong>Completed At:</strong> {{ now()->format('M d, Y h:i A') }}
            </p>

            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ route('admin.orders.index') }}" style="background-color: #111827; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Order</a>
            </div>
        </div>
    </div>
</body>
</html>
