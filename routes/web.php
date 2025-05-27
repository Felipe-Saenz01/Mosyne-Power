<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LeitnerBoxController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Rutas para Flashcards
    Route::get('/flashcards', [FlashcardController::class, 'index'])->name('flashcards.index');
    Route::get('/flashcards/create', [FlashcardController::class, 'create'])->name('flashcards.create');
    Route::post('/flashcards', [FlashcardController::class, 'store'])->name('flashcards.store');
    Route::get('/flashcards/{flashcard}', [FlashcardController::class, 'show'])->name('flashcards.show');
    Route::get('/flashcards/{flashcard}/edit', [FlashcardController::class, 'edit'])->name('flashcards.edit');
    Route::put('/flashcards/{flashcard}', [FlashcardController::class, 'update'])->name('flashcards.update');
    Route::delete('/flashcards/{flashcard}', [FlashcardController::class, 'destroy'])->name('flashcards.destroy');
    Route::get('/flashcards-due', [FlashcardController::class, 'getDueFlashcards'])->name('flashcards.due');

    // Rutas para Revisiones
    Route::post('/flashcards/{flashcard}/review', [ReviewController::class, 'recordReview'])->name('flashcards.review');
    Route::get('/flashcards/{flashcard}/history', [ReviewController::class, 'getReviewHistory'])->name('flashcards.history');
    Route::get('/review/today-progress', [ReviewController::class, 'getTodayProgress'])->name('review.progress');

    // Rutas para Cajas de Leitner
    Route::get('/leitner-boxes', [LeitnerBoxController::class, 'index'])->name('leitner.index');
    Route::get('/leitner-boxes/initialize', [LeitnerBoxController::class, 'initializeBoxes'])->name('leitner.initialize');
    Route::get('/leitner-boxes/{leitnerBox}', [LeitnerBoxController::class, 'show'])->name('leitner.show');
    Route::get('/leitner-boxes/{leitnerBox}/stats', [LeitnerBoxController::class, 'getBoxStats'])->name('leitner.stats');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
