<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Flashcard;
use Illuminate\Support\Facades\Auth;
use App\Traits\UsesSimulatedDate;

class FlashcardOfTheDayController extends Controller
{
    use UsesSimulatedDate;

    public function index()
    {
        $user = Auth::user();
        
        // Get due flashcards
        $dueFlashcards = $user->flashcards()
            ->where('next_review_at', '<=', $this->now())
            ->with('leitnerBox')
            ->get();

        // Aplicar penalizaciones por inconsistencia
        $dueFlashcards->each(function ($flashcard) {
            $flashcard->penalizeForInconsistency();
        });

        // Get review stats
        $stats = [
            'total_due' => $dueFlashcards->count(),
            'completed_today' => $user->reviewHistory()
                ->whereDate('reviewed_at', $this->now()->toDateString())
                ->count(),
            'success_rate' => $user->reviewHistory()
                ->whereDate('reviewed_at', $this->now()->toDateString())
                ->where('remembered', true)
                ->count() / max(1, $user->reviewHistory()->whereDate('reviewed_at', $this->now()->toDateString())->count()) * 100
        ];

        // Get all due flashcards
        $flashcards = $dueFlashcards->all();

        return Inertia::render('FlashcardOfTheDay/Index', [
            'stats' => $stats,
            'flashcards' => $flashcards,
            'totalDue' => $dueFlashcards->count()
        ]);
    }
} 