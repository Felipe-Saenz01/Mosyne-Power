<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\LeitnerBox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FlashcardController extends Controller
{
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

        // Obtener la primera caja de Leitner del usuario
        $firstBox = LeitnerBox::where('user_id', Auth::id())
            ->where('box_number', 1)
            ->firstOrFail();

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
        $dueFlashcards = Flashcard::with('leitnerBox')
            ->where('user_id', Auth::id())
            ->where('next_review_at', '<=', now())
            ->get();

        // Aplicar penalizaciones por inconsistencia
        $dueFlashcards->each(function ($flashcard) {
            $flashcard->penalizeForInconsistency();
        });

        return Inertia::render('Flashcards/Review', [
            'flashcards' => $dueFlashcards
        ]);
    }
} 