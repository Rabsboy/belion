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
        .item-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .item-info { flex: 1; }
        .item-name { font-weight: bold; color: #111827; }
        .item-details { font-size: 12px; color: #6b7280; }
        .item-price { font-weight: bold; color: #111827; margin-left: 20px; }
        .summary { background-color: #f9fafb; padding: 20px; border-radius: 15px; margin-top: 30px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb; font-size: 20px; font-weight: 800; color: #ea580c; }
        .footer { text-align: center; padding: 30px; font-size: 12px; color: #9ca3af; }
        .btn { display: inline-block; background-color: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ea580c; color: white; padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</p>
            </div>
            <div style="background-color: #ffffff; padding: 40px 30px; border: 1px solid #f3f4f6; border-radius: 0 0 20px 20px;">
                <p>Hi {{ $order->client_name ?? $order->user->name ?? 'Customer' }},</p>
                <p>Your order has been successfully placed and is now being prepared. Here's your invoice details:</p>
    
                <div style="font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">Delivery To</div>
                <p style="margin-bottom: 30px; color: #4b5563;">
                    {{ $order->address }}<br>
                    <strong>Phone:</strong> {{ $order->client_phone ?? $order->user->phone ?? 'N/A' }}
                </p>
    
                <div style="font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">Order Items</div>
                @foreach($order->items as $item)
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #111827;">{{ $item->quantity }}x {{ $item->product_name }}</div>
                        @if(isset($item->selected_options['variation']))
                            <div style="font-size: 12px; color: #6b7280;">Size: {{ $item->selected_options['variation']['name'] }}</div>
                        @endif
                        @if(isset($item->selected_options['options']) && count($item->selected_options['options']) > 0)
                            <div style="font-size: 12px; color: #6b7280;">
                                Extras: {{ collect($item->selected_options['options'])->pluck('name')->implode(', ') }}
                            </div>
                        @endif
                    </div>
                    <div style="font-weight: bold; color: #111827; margin-left: 20px;">{{ formatRupiah($item->line_total) }}</div>
                </div>
                @endforeach
    
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 15px; margin-top: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Subtotal</span>
                        <span>{{ formatRupiah($order->subtotal) }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Delivery Fee</span>
                        <span>{{ formatRupiah($order->delivery_fee) }}</span>
                    </div>
                    @if($order->discount_amount > 0)
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #16a34a; font-weight: bold;">
                        <span>Discount ({{ $order->coupon->code ?? 'Coupon' }})</span>
                        <span>-{{ formatRupiah($order->discount_amount) }}</span>
                    </div>
                    @endif
                    <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb; font-size: 20px; font-weight: 800; color: #ea580c;">
                        <span>Total Paid</span>
                        <span>{{ formatRupiah($order->total) }}</span>
                    </div>
                </div>
            </div>
            <div style="text-align: center; padding: 30px; font-size: 12px; color: #9ca3af;">
                &copy; {{ date('Y') }} Food Delivery System. All rights reserved.<br>
                If you have any questions, please contact our support.
            </div>
        </div>
    </div>
</html>
