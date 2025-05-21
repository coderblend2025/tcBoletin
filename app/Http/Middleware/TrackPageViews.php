<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\PageView;

class TrackPageViews
{
    public function handle($request, Closure $next)
    {
        PageView::create([
            'ip' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'path' => $request->path()
        ]);

        return $next($request);
    }
}