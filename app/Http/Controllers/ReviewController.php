<?php
namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\ReviewHistory;
use App\Models\LeitnerBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\UsesSimulatedDate;

class ReviewController extends Controller
{
    use UsesSimulatedDate;

    public function recordReview(Request $request, Flashcard $flashcard)
    {
        // Verificar que la flashcard pertenece al usuario
        if ($flashcard->user_id !== Auth::id()) {
            abort(403);
        }

        $remembered = $request->boolean('remembered');
        $currentBox = $flashcard->leitnerBox;

        // Registrar la revisión
        ReviewHistory::create([
            'user_id' => Auth::id(),
            'flashcard_id' => $flashcard->id,
            'remembered' => $remembered,
            'reviewed_at' => $this->now(),
            'previous_box' => $currentBox->box_number,
            'new_box' => $remembered ? min($currentBox->box_number + 1, 5) : 1,
            'days_overdue' => $flashcard->getDaysOverdue()
        ]);

        // Actualizar la caja y la próxima fecha de revisión
        if ($remembered) {
            // Si la recordó, mover a la siguiente caja
            $nextBox = LeitnerBox::where('user_id', Auth::id())
                ->where('box_number', $currentBox->box_number + 1)
                ->first();

            if ($nextBox) {
                $flashcard->leitner_box_id = $nextBox->id;
                $flashcard->next_review_at = $nextBox->calculateNextReviewDate();
            } else {
                // Si ya está en la última caja, mantener en la misma pero actualizar fecha
                $flashcard->next_review_at = $currentBox->calculateNextReviewDate();
            }
        } else {
            // Si no la recordó, volver a la primera caja
            $firstBox = LeitnerBox::where('user_id', Auth::id())
                ->where('box_number', 1)
                ->first();

            $flashcard->leitner_box_id = $firstBox->id;
            $flashcard->next_review_at = $firstBox->calculateNextReviewDate();
        }

        $flashcard->save();

        return redirect()->back();
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
        $today = $this->now()->startOfDay();
        $tomorrow = $today->copy()->addDay();

        $stats = [
            'completed' => ReviewHistory::where('user_id', Auth::id())
                ->whereBetween('reviewed_at', [$today, $tomorrow])
                ->count(),
            'success_rate' => ReviewHistory::where('user_id', Auth::id())
                ->whereBetween('reviewed_at', [$today, $tomorrow])
                ->avg('remembered') * 100,
            'total_due' => Flashcard::where('user_id', Auth::id())
                ->where('next_review_at', '<=', $this->now())
                ->count()
        ];

        return response()->json($stats);
    }

    public function getAnalytics()
    {
        $today = $this->now()->startOfDay();
        $lastWeek = $today->copy()->subDays(7);

        // Get daily stats
        $dailyStats = ReviewHistory::where('user_id', Auth::id())
            ->whereBetween('reviewed_at', [$lastWeek, $today])
            ->get()
            ->groupBy(function ($review) {
                return $review->reviewed_at->format('Y-m-d');
            })
            ->map(function ($dayReviews) {
                $totalReviews = $dayReviews->count();
                $successfulReviews = $dayReviews->where('remembered', true)->count();
                
                return [
                    'date' => $dayReviews->first()->reviewed_at->format('M d'),
                    'reviewCount' => $totalReviews,
                    'successRate' => $totalReviews > 0 ? ($successfulReviews / $totalReviews) * 100 : 0,
                    'averageResponseTime' => 0 // Not implemented yet
                ];
            })
            ->values();

        // Get box distribution
        $boxDistribution = LeitnerBox::where('user_id', Auth::id())
            ->withCount('flashcards')
            ->orderBy('box_number')
            ->get()
            ->map(function ($box) {
                return [
                    'boxNumber' => $box->box_number,
                    'cardCount' => $box->flashcards_count
                ];
            });

        // Calculate total reviews and success rate
        $totalReviews = ReviewHistory::where('user_id', Auth::id())->count();
        $successfulReviews = ReviewHistory::where('user_id', Auth::id())
            ->where('remembered', true)
            ->count();
        $averageSuccessRate = $totalReviews > 0 ? $successfulReviews / $totalReviews : 0;

        // Calculate streak
        $streakDays = $this->calculateStreakDays();

        // Get most reviewed topics
        $mostReviewedTopics = Flashcard::where('user_id', Auth::id())
            ->withCount('reviewHistory')
            ->orderByDesc('review_history_count')
            ->limit(5)
            ->get()
            ->map(function ($flashcard) {
                return [
                    'topic' => substr($flashcard->front_content, 0, 30) . '...',
                    'count' => $flashcard->review_history_count
                ];
            });

        return Inertia::render('Review/Analytics', [
            'dailyStats' => $dailyStats,
            'boxDistribution' => $boxDistribution,
            'totalReviews' => $totalReviews,
            'averageSuccessRate' => $averageSuccessRate,
            'streakDays' => $streakDays,
            'mostReviewedTopics' => $mostReviewedTopics
        ]);
    }

    private function calculateStreakDays()
    {
        $streak = 0;
        $date = $this->now()->startOfDay();
        $user = Auth::user();
        
        while (true) {
            $hasReviews = ReviewHistory::where('user_id', $user->id)
                ->whereDate('reviewed_at', $date)
                ->exists();
                
            if (!$hasReviews) {
                break;
            }
            
            $streak++;
            $date = $date->subDay();
        }
        
        return $streak;
    }
} 