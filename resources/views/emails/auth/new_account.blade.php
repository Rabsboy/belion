<!DOCTYPE html>
<html>
<head>
    <title>Account Created</title>
</head>
<body>
    <h1>Welcome to Our Service!</h1>
    <p>Hello {{ $user->name }},</p>
    <p>An account has been created for you at our store. You can use your phone number or email to login.</p>
    <p><strong>Your Login Credentials:</strong></p>
    <ul>
        <li><strong>Email:</strong> {{ $user->email }}</li>
        <li><strong>Phone:</strong> {{ $user->phone }}</li>
        <li><strong>Password:</strong> {{ $password }}</li>
    </ul>
    <p>Please login and change your password as soon as possible.</p>
    <p>Thank you for shopping with us!</p>
</body>
</html>
