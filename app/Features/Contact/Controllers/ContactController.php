<?php

namespace App\Features\Contact\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Features\Contact\Models\ContactMessage;
class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => ['nullable', 'string', 'regex:/^01[3,4,6,7,8,9]\d{8}$/'],
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);
        
        return back()->with('success', 'Thank you for contacting us!');
    }
}
