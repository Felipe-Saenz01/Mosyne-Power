<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $user = $request->user();
        $reviewStats = [];

        if ($user) {
            $today = now()->startOfDay();
            
            $reviewStats = [
                'cardsToReview' => $user->flashcards()
                    ->where('next_review_at', '<=', now())
                    ->count(),
                'completedToday' => $user->reviewHistory()
                    ->whereDate('reviewed_at', today())
                    ->count(),
                'totalCards' => $user->flashcards()->count(),
                'successRate' => $user->reviewHistory()
                    ->whereDate('reviewed_at', today())
                    ->where('remembered', true)
                    ->count() / max(1, $user->reviewHistory()->whereDate('reviewed_at', today())->count())
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
            'reviewStats' => $reviewStats,
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
