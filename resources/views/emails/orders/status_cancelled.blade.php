<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ef4444; color: white; padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { background-color: #ffffff; padding: 40px 30px; border: 1px solid #f3f4f6; border-radius: 0 0 20px 20px; }
        .section-title { font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
        .status-badge { display: inline-block; background-color: #fef2f2; color: #ef4444; font-weight: bold; padding: 10px 20px; border-radius: 30px; margin-bottom: 20px; border: 1px solid #fecaca; }
        .footer { text-align: center; padding: 30px; font-size: 12px; color: #9ca3af; }
        .support-link { color: #ef4444; font-weight: bold; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Cancelled</h1>
            <p>Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
        <div class="content">
            <p>Hi {{ $order->client_name ?? $order->user->name ?? 'Customer' }},</p>
            
            <div style="text-align: center;">
                <div class="status-badge">Status: CANCELLED</div>
                <p style="color: #4b5563; font-size: 16px;">
                    We're sorry to inform you that your order has been cancelled. 
                </p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                    If you didn't request this or have any questions about your refund (if applicable), please reach out to our support team.
                </p>
                <p style="margin-top: 20px;">
                    <a href="mailto:support@example.com" class="support-link">Contact Support</a>
                </p>
            </div>

            <div class="section-title" style="margin-top: 40px;">Order Reference</div>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 10px; font-size: 14px;">
                <strong>Order Total:</strong> {{ formatRupiah($order->total) }}<br>
                <strong>Date:</strong> {{ $order->created_at->format('M d, Y h:i A') }}
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Food Delivery System. All rights reserved.<br>
            We hope to serve you better next time.
        </div>
    </div>
</body>
</html>
