<?php
namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function recordReview(Request $request, Flashcard $flashcard)
    {
        $validated = $request->validate([
            'remembered' => 'required|boolean',
        ]);

        // Registrar la revisión y mover la tarjeta a la caja correspondiente
        $flashcard->recordReview($validated['remembered']);

        return redirect()->back()->with('success', 'Revisión registrada correctamente');
    }

    public function getReviewHistory(Flashcard $flashcard)
    {
        $history = $flashcard->reviewHistory()
            ->orderBy('reviewed_at', 'desc')
            ->get();

        return Inertia::render('Flashcards/History', [
            'flashcard' => $flashcard,
            'history' => $history
        ]);
    }

    public function getTodayProgress()
    {
        $today = now()->startOfDay();
        
        $stats = [
            'total_due' => Auth::user()
                ->flashcards()
                ->where('next_review_at', '<=', now())
                ->count(),
                
            'completed_today' => Auth::user()
                ->flashcards()
                ->whereHas('reviewHistory', function ($query) use ($today) {
                    $query->where('reviewed_at', '>=', $today);
                })
                ->count(),
                
            'success_rate_today' => Auth::user()
                ->flashcards()
                ->whereHas('reviewHistory', function ($query) use ($today) {
                    $query->where('reviewed_at', '>=', $today);
                })
                ->withCount(['reviewHistory as remembered_count' => function ($query) use ($today) {
                    $query->where('reviewed_at', '>=', $today)
                        ->where('remembered', true);
                }])
                ->get()
                ->avg('remembered_count')
        ];

        return Inertia::render('Review/Progress', [
            'stats' => $stats
        ]);
    }
} 