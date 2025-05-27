<?php

namespace App\Http\Controllers;

use App\Models\LeitnerBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeitnerBoxController extends Controller
{
    public function index()
    {
        $boxes = LeitnerBox::where('user_id', Auth::id())
            ->withCount(['flashcards as flashcards_count', 'flashcards as due_count' => function ($query) {
                $query->where('next_review_at', '<=', now());
            }])
            ->get();

        return Inertia::render('LeitnerBox/Index', [
            'boxes' => $boxes
        ]);
    }

    public function initializeBoxes()
    {
        // Crear las 5 cajas de Leitner para el usuario si no existen
        $defaultBoxes = [
            ['name' => 'Diario', 'box_number' => 1, 'review_interval' => 1],
            ['name' => 'Cada 3 días', 'box_number' => 2, 'review_interval' => 3],
            ['name' => 'Semanal', 'box_number' => 3, 'review_interval' => 7],
            ['name' => 'Quincenal', 'box_number' => 4, 'review_interval' => 14],
            ['name' => 'Mensual', 'box_number' => 5, 'review_interval' => 30],
        ];

        foreach ($defaultBoxes as $box) {
            LeitnerBox::firstOrCreate(
                [
                    'user_id' => Auth::id(),
                    'box_number' => $box['box_number']
                ],
                [
                    'name' => $box['name'],
                    'review_interval' => $box['review_interval']
                ]
            );
        }

        return redirect()->route('leitner.index');
    }

    public function show(LeitnerBox $leitnerBox)
    {
        // Verificar que la caja pertenece al usuario
        if ($leitnerBox->user_id !== Auth::id()) {
            abort(403);
        }

        $leitnerBox->load('flashcards');

        // Calcular estadísticas
        $stats = [
            'success_rate' => $this->calculateSuccessRate($leitnerBox),
            'total_reviews' => $this->calculateTotalReviews($leitnerBox),
            'average_days_to_advance' => $this->calculateAverageDaysToAdvance($leitnerBox),
        ];

        return Inertia::render('LeitnerBox/Show', [
            'box' => array_merge($leitnerBox->toArray(), ['stats' => $stats])
        ]);
    }

    public function getBoxStats(LeitnerBox $leitnerBox)
    {
        // Verificar que la caja pertenece al usuario
        if ($leitnerBox->user_id !== Auth::id()) {
            abort(403);
        }

        $stats = [
            'total_cards' => $leitnerBox->flashcards()->count(),
            'due_cards' => $leitnerBox->flashcards()
                ->where('next_review_at', '<=', now())
                ->count(),
            'success_rate' => $this->calculateSuccessRate($leitnerBox),
        ];

        return Inertia::render('LeitnerBox/Stats', [
            'box' => $leitnerBox,
            'stats' => $stats
        ]);
    }

    private function calculateSuccessRate(LeitnerBox $leitnerBox)
    {
        $flashcardsWithReviews = $leitnerBox->flashcards()
            ->withCount(['reviewHistory as success_count' => function ($query) {
                $query->where('remembered', true);
            }])
            ->withCount('reviewHistory as total_reviews')
            ->get();

        if ($flashcardsWithReviews->isEmpty()) {
            return 0;
        }

        return $flashcardsWithReviews
            ->map(function ($card) {
                return $card->total_reviews > 0
                    ? ($card->success_count / $card->total_reviews) * 100
                    : 0;
            })
            ->avg();
    }

    private function calculateTotalReviews(LeitnerBox $leitnerBox)
    {
        return $leitnerBox->flashcards()
            ->withCount('reviewHistory')
            ->get()
            ->sum('review_history_count');
    }

    private function calculateAverageDaysToAdvance(LeitnerBox $leitnerBox)
    {
        // Implementar lógica para calcular el promedio de días que toma avanzar de esta caja
        // Por ahora retornamos un valor fijo
        return $leitnerBox->review_interval;
    }
} 