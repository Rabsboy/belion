<!DOCTYPE html>
<html>
<head>
    <title>Reply to your message</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316;">Bellion Bake & Brew Support</h2>
        
        <p>Dear {{ $name }},</p>
        
        <p>Thank you for contacting us regarding "<strong>{{ $subject }}</strong>".</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
            <p style="margin: 0;"><strong>Our Reply:</strong></p>
            <p style="margin-top: 10px;">{!! nl2br(e($replyMessage)) !!}</p>
        </div>
        
        <p>If you have any further questions, please don't hesitate to reach out.</p>
        
        <p>Best regards,<br>The Bellion Bake & Brew Team</p>
    </div>
</body>
</html>
