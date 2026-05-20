<?php

namespace App\Features\Orders\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericMail;
use App\Features\Orders\Models\Order;
use Illuminate\Support\Facades\Log;

class TestMailController extends Controller
{
    public function test()
    {
        $email = request('email') ?? env('ADMIN_EMAIL');
        
        if (!$email) {
            return "Please provide an email or set ADMIN_EMAIL in .env";
        }

        try {
            Log::info("Attempting to send test mail to: " . $email);
            Mail::to($email)->send(new GenericMail(
                subject: 'Test Email - ' . now(),
                view: 'emails.auth.new_account',
                data: [
                    'user' => (object)['name' => 'Test User', 'email' => $email, 'phone' => '1234567890'],
                    'password' => 'secret123'
                ]
            ));
            return "Email sent successfully to " . $email . ". Check logs for details.";
        } catch (\Exception $e) {
            Log::error("Test mail failed: " . $e->getMessage());
            return "Email failed: " . $e->getMessage();
        }
    }
}
