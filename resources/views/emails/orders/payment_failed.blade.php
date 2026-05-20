<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .alert {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #dc2626;
        }
        .order-details {
            background: #f9fafb;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #ea580c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Failed</h1>
            <p>Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
        
        <div class="content">
            <div class="alert">
                <strong>⚠️ Payment could not be processed</strong>
                <p style="margin: 10px 0 0 0;">Your payment attempt for this order was unsuccessful. You can try again or choose a different payment method.</p>
            </div>

            <h2>Order Details</h2>
            <div class="order-details">
                <div class="detail-row">
                    <strong>Order ID:</strong>
                    <span>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Customer:</strong>
                    <span>{{ $order->client_name }}</span>
                </div>
                <div class="detail-row">
                    <strong>Total Amount:</strong>
                    <span>{{ formatRupiah($order->total) }}</span>
                </div>
                <div class="detail-row">
                    <strong>Payment Status:</strong>
                    <span style="color: #dc2626; font-weight: bold;">Failed</span>
                </div>
            </div>

            <h3>Items</h3>
            @foreach($order->items as $item)
            <div class="detail-row">
                <span>{{ $item->product_name }} × {{ $item->quantity }}</span>
                <span>{{ formatRupiah($item->line_total) }}</span>
            </div>
            @endforeach

            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/') }}" class="btn">Try Payment Again</a>
            </div>

            <p style="margin-top: 30px; color: #6b7280;">
                If you continue to experience issues with payment, please contact our support team or try using Cash on Delivery option.
            </p>
        </div>

        <div class="footer">
            <p>Thank you for choosing us!</p>
            <p>If you have any questions, please contact us.</p>
        </div>
    </div>
</body>
</html>
