<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\LeitnerBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\UsesSimulatedDate;

class FlashcardController extends Controller
{
    use UsesSimulatedDate;

    public function index()
    {
        $flashcards = Flashcard::with('leitnerBox')
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Flashcards/Index', [
            'flashcards' => $flashcards
        ]);
    }

    public function create()
    {
        return Inertia::render('Flashcards/Create', [
            'isEditing' => false
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'front_content' => 'required|string',
            'back_content' => 'required|string',
        ]);

        // Verificar si el usuario tiene cajas de Leitner
        $user = Auth::user();
        $firstBox = $user->leitnerBoxes()->where('box_number', 1)->first();

        // Si no tiene cajas, inicializarlas
        if (!$firstBox) {
            $defaultBoxes = [
                ['name' => 'Diario', 'box_number' => 1, 'review_interval' => 1],
                ['name' => 'Cada 3 días', 'box_number' => 2, 'review_interval' => 3],
                ['name' => 'Semanal', 'box_number' => 3, 'review_interval' => 7],
                ['name' => 'Quincenal', 'box_number' => 4, 'review_interval' => 14],
                ['name' => 'Mensual', 'box_number' => 5, 'review_interval' => 30],
            ];

            foreach ($defaultBoxes as $box) {
                if ($box['box_number'] === 1) {
                    $firstBox = $user->leitnerBoxes()->create([
                        'name' => $box['name'],
                        'box_number' => $box['box_number'],
                        'review_interval' => $box['review_interval']
                    ]);
                } else {
                    $user->leitnerBoxes()->create([
                        'name' => $box['name'],
                        'box_number' => $box['box_number'],
                        'review_interval' => $box['review_interval']
                    ]);
                }
            }
        }

        $flashcard = new Flashcard([
            'front_content' => $validated['front_content'],
            'back_content' => $validated['back_content'],
            'user_id' => Auth::id(),
            'leitner_box_id' => $firstBox->id,
            'next_review_at' => $firstBox->calculateNextReviewDate(),
        ]);

        $flashcard->save();

        return redirect()->route('flashcards.index');
    }

    public function show(Flashcard $flashcard)
    {
        // Verificar que la flashcard pertenece al usuario
        if ($flashcard->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Flashcards/Show', [
            'flashcard' => $flashcard->load('leitnerBox')
        ]);
    }

    public function edit(Flashcard $flashcard)
    {
        // Verificar que la flashcard pertenece al usuario
        if ($flashcard->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Flashcards/Edit', [
            'flashcard' => $flashcard->load('leitnerBox')
        ]);
    }

    public function update(Request $request, Flashcard $flashcard)
    {
        // Verificar que la flashcard pertenece al usuario
        if ($flashcard->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'front_content' => 'required|string',
            'back_content' => 'required|string',
        ]);

        $flashcard->update($validated);

        return redirect()->route('flashcards.show', $flashcard);
    }

    public function destroy(Flashcard $flashcard)
    {
        // Verificar que la flashcard pertenece al usuario
        if ($flashcard->user_id !== Auth::id()) {
            abort(403);
        }

        $flashcard->delete();
        return redirect()->route('flashcards.index');
    }

    public function getDueFlashcards()
    {
        $flashcards = Flashcard::with('leitnerBox')
            ->where('user_id', Auth::id())
            ->whereDate('next_review_at', '<=', now())
            ->get();
        // $flashcards = auth()->user()->flashcards()
        //     ->with('leitnerBox')
        //     ->whereDate('next_review_at', '<=', now())
        //     ->get();

        return Inertia::render('Flashcards/Review', [
            'flashcards' => $flashcards,
        ]);
    }
} 