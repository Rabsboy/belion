<?php

namespace App\Features\About\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('About/About/About');
    }

    public function privacy()
    {
        return Inertia::render('About/PrivacyPolicy/PrivacyPolicy');
    }

    public function cookie()
    {
        return Inertia::render('About/CookiePolicy/CookiePolicy');
    }

    public function terms()
    {
        return Inertia::render('About/TermsAndConditions/TermsAndConditions');
    }
}
