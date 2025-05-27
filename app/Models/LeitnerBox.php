<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeitnerBox extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'box_number',
        'review_interval'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function flashcards(): HasMany
    {
        return $this->hasMany(Flashcard::class);
    }

    // Método para obtener las flashcards que necesitan revisión hoy
    public function getFlashcardsForReviewToday()
    {
        return $this->flashcards()
            ->where('next_review_at', '<=', now())
            ->get();
    }

    // Método para calcular la próxima fecha de revisión
    public function calculateNextReviewDate()
    {
        return now()->addDays($this->review_interval);
    }
}
