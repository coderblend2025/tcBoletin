<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PageView;
use App\Models\ExchangePoint;
use App\Models\LocationMoneyChanger;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_users' => $this->getTotalUsers(),
                'new_users_this_week' => $this->getNewUsersThisWeek(),
                'active_sellers_today' => $this->getActiveSellersToday(),
                'total_page_views' => $this->getTotalPageViews(),
                'unique_visits_today' => $this->getUniqueVisitsToday(),
                'total_exchange_points' => $this->getTotalExchangePoints(),
            ],
        ]);
    }

    public function getStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'new_users_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
            'active_sellers_today' => User::whereHas('roles', fn($q) => $q->where('name', 'seller'))
                ->count(),
            'total_page_views' => PageView::count(),
            'unique_visits_today' => PageView::whereDate('created_at', today())->distinct('ip')->count(),
            'total_exchange_points' => LocationMoneyChanger::count(),
        ]);
    }
    
    protected function getTotalUsers(): int
    {
        return User::count();
    }

    protected function getNewUsersThisWeek(): int
    {
        return User::where('created_at', '>=', now()->subWeek())->count();
    }

    protected function getActiveSellersToday(): int
    {
        return User::whereHas('roles', function($q) {
                $q->where('name', 'seller');
            })
            ->where('last_active_at', '>=', today())
            ->count();
    }

    protected function getTotalPageViews(): int
    {
        return PageView::count();
    }

    protected function getUniqueVisitsToday(): int
    {
        return PageView::whereDate('created_at', today())
            ->distinct('ip')
            ->count('ip');
    }

    protected function getTotalExchangePoints(): int
    {
        return ExchangePoint::count();
    }
}