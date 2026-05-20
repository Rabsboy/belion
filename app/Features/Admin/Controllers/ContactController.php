<?php

namespace App\Features\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Contact\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\GenericMail;

class ContactController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::latest()->paginate(10);

        return Inertia::render('Admin/ContactRequests', [
            'messages' => $messages,
        ]);
    }

    public function update(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,resolved',
        ]);

        $oldStatus = $contactMessage->status;
        $contactMessage->update([
            'status' => $validated['status'],
        ]);

        // Automatically send email if status changed
        if ($oldStatus !== $validated['status']) {
            try {
                defer(static function () use ($contactMessage) {
                    Mail::to($contactMessage->email)->send(
                        new GenericMail(
                            subject: 'Re: ' . $contactMessage->subject,
                            view: 'emails.contact.status_updated',
                            data: ['contactMessage' => $contactMessage]
                        )
                    );
                });
            } catch (\Exception $e) {
                \Log::error('Contact status update email failed: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Request status updated successfully.');
    }
}
