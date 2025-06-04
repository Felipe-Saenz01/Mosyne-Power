<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LeitnerBoxController;
use App\Http\Controllers\FlashcardOfTheDayController;
use App\Http\Controllers\SystemController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Make Flashcard of the Day the default landing page after login
    Route::get('/dashboard', [FlashcardOfTheDayController::class, 'index'])->name('dashboard');

    // Rutas para Flashcards
    Route::get('/flashcards', [FlashcardController::class, 'index'])->name('flashcards.index');
    Route::get('/flashcards/create', [FlashcardController::class, 'create'])->name('flashcards.create');
    Route::post('/flashcards', [FlashcardController::class, 'store'])->name('flashcards.store');
    Route::get('/flashcards/{flashcard}', [FlashcardController::class, 'show'])->name('flashcards.show');
    Route::get('/flashcards/{flashcard}/edit', [FlashcardController::class, 'edit'])->name('flashcards.edit');
    Route::put('/flashcards/{flashcard}', [FlashcardController::class, 'update'])->name('flashcards.update');
    Route::delete('/flashcards/{flashcard}', [FlashcardController::class, 'destroy'])->name('flashcards.destroy');
    Route::get('/flashcards/due', [FlashcardController::class, 'getDueFlashcards'])->name('flashcards.due');

    // Rutas para Revisiones
    Route::post('/flashcards/{flashcard}/review', [ReviewController::class, 'recordReview'])->name('flashcards.review');
    Route::get('/flashcards/{flashcard}/history', [ReviewController::class, 'getReviewHistory'])->name('flashcards.history');
    Route::get('/review/today-progress', [ReviewController::class, 'getTodayProgress'])->name('review.progress');
    Route::get('/review/analytics', [ReviewController::class, 'getAnalytics'])->name('review.analytics');

    // Rutas para Cajas de Leitner
    Route::get('/leitner-boxes', [LeitnerBoxController::class, 'index'])->name('leitner.index');
    Route::get('/leitner-boxes/initialize', [LeitnerBoxController::class, 'initializeBoxes'])->name('leitner.initialize');
    Route::get('/leitner-boxes/{leitnerBox}', [LeitnerBoxController::class, 'show'])->name('leitner.show');
    Route::get('/leitner-boxes/{leitnerBox}/stats', [LeitnerBoxController::class, 'getBoxStats'])->name('leitner.stats');

    // Rutas del Sistema
    Route::post('/system/advance-day', [SystemController::class, 'advanceDay'])->name('system.advance-day');
    Route::post('/system/reset-date', [SystemController::class, 'resetDate'])->name('system.reset-date');
    Route::get('/system/current-date', [SystemController::class, 'getCurrentDate'])->name('system.current-date');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
