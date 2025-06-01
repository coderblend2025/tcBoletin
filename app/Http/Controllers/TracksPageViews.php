<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\PageView;

class TrackPageViewMiddleware
{
    public function handle($request, Closure $next)
    {
        if ($request->isMethod('GET')) {
            PageView::create([
                'ip' => $request->ip(),
                'user_agent' => substr($request->header('User-Agent'), 0, 500),
                'path' => $request->path(),
                'user_id' => auth()->id()
            ]);
        }

        return $next($request);
    }
}