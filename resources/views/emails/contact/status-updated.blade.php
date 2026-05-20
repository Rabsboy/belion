<!DOCTYPE html>
<html>
<head>
    <title>Contact Request Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316;">Bellion Bake & Brew Support</h2>
        
        <p>Dear {{ $contactMessage->name }},</p>
        
        <p>Your contact request regarding "<strong>{{ $contactMessage->subject }}</strong>" has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
            <p style="margin: 0;"><strong>New Status:</strong> <span style="text-transform: capitalize; color: {{ $contactMessage->status === 'resolved' ? '#15803d' : '#a16207' }};">{{ $contactMessage->status }}</span></p>
        </div>
        
        <p>If you have any further questions, please feel free to contact us again.</p>
        
        <p>Best regards,<br>The Bellion Bake & Brew Team</p>
    </div>
</body>
</html>
