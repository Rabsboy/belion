<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Midtrans Payment</title>
</head>
<body>
    <div style="max-width:520px;margin:24px auto;font-family:Arial,Helvetica,sans-serif;">
        <h3>Redirecting to payment...</h3>
        <p>If you are not redirected automatically, click the button below.</p>
        <button id="pay-button" style="padding:10px 16px;background:#635bff;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Pay</button>
    </div>

    <script src="https://{{ env('MIDTRANS_IS_SANDBOX', true) ? 'app.sandbox' : 'app' }}.midtrans.com/snap/snap.js"></script>

    <script type="text/javascript">
        const token = @json($token);

        // MIDTRANS_CLIENT_KEY must be set in .env
        const clientKey = @json(env('MIDTRANS_CLIENT_KEY'));
        if (!clientKey) {
            alert('MIDTRANS_CLIENT_KEY is not set in .env');
        }

        // Initialize snap
        window.snap = window.snap || {};

        // Set client key
        window.snap.clientKey = clientKey;

        document.getElementById('pay-button').addEventListener('click', function () {
            if (!clientKey) return;
            window.snap.pay(token);
        });

        // Auto click
        document.getElementById('pay-button').click();
    </script>
</body>
</html>

