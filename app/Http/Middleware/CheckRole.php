<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        foreach ($roles as $role) {
            foreach (explode(',', $role) as $r) {
                if ($request->user()->role === trim($r)) {
                    return $next($request);
                }
            }
        }

        return redirect()->route('home')->with('error', 'You do not have permission to access that page.');
    }
}
