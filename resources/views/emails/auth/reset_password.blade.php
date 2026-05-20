<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ea580c; text-align: center;">Reset Your Password</h1>
        
        <p>Hello {{ $user->name }},</p>
        
        <p>You satisfy this email because we received a password reset request for your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $url }}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p>This password reset link will expire in 30 minutes.</p>
        
        <p>If you did not request a password reset, no further action is required.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
        <p style="font-size: 12px; color: #666; text-align: center; word-break: break-all;">{{ $url }}</p>
    </div>
</body>
</html>
