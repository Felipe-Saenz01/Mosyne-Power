<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Flashcard extends Model
{
    protected $fillable = [
        'user_id',
        'leitner_box_id',
        'front_content',
        'back_content',
        'last_reviewed_at',
        'next_review_at',
        'consecutive_misses'
    ];

    protected $casts = [
        'last_reviewed_at' => 'datetime',
        'next_review_at' => 'datetime',
        'consecutive_misses' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leitnerBox(): BelongsTo
    {
        return $this->belongsTo(LeitnerBox::class);
    }

    public function reviewHistory(): HasMany
    {
        return $this->hasMany(ReviewHistory::class);
    }

    // Método para mover la tarjeta a la siguiente caja
    public function moveToNextBox()
    {
        $nextBoxNumber = $this->leitnerBox->box_number + 1;
        $nextBox = LeitnerBox::where('box_number', $nextBoxNumber)
            ->where('user_id', $this->user_id)
            ->first();

        if ($nextBox) {
            $this->leitner_box_id = $nextBox->id;
            $this->next_review_at = $nextBox->calculateNextReviewDate();
            $this->last_reviewed_at = now();
            $this->save();
        }
    }

    // Método para mover la tarjeta a la primera caja
    public function moveToFirstBox()
    {
        $firstBox = LeitnerBox::where('box_number', 1)
            ->where('user_id', $this->user_id)
            ->first();

        $this->leitner_box_id = $firstBox->id;
        $this->next_review_at = $firstBox->calculateNextReviewDate();
        $this->last_reviewed_at = now();
        $this->save();
    }

    // Método para verificar si una tarjeta está atrasada
    public function isOverdue(): bool
    {
        return $this->next_review_at && $this->next_review_at->isPast();
    }

    // Método para obtener días de atraso
    public function getDaysOverdue(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return $this->next_review_at->diffInDays(now());
    }

    // Método para penalizar por falta de constancia
    public function penalizeForInconsistency()
    {
        $daysOverdue = $this->getDaysOverdue();
        
        if ($daysOverdue > 0) {
            $this->consecutive_misses++;
            
            // Si tiene más de 3 días consecutivos sin revisar, la tarjeta vuelve a la primera caja
            if ($this->consecutive_misses >= 3) {
                $this->moveToFirstBox();
                $this->consecutive_misses = 0;
            } else {
                // Si tiene menos de 3 días, retrocede una caja
                $this->moveToPreviousBox();
            }
            
            $this->save();
        }
    }

    // Método para mover la tarjeta a la caja anterior
    public function moveToPreviousBox()
    {
        $previousBoxNumber = max(1, $this->leitnerBox->box_number - 1);
        $previousBox = LeitnerBox::where('box_number', $previousBoxNumber)
            ->where('user_id', $this->user_id)
            ->first();

        if ($previousBox) {
            $this->leitner_box_id = $previousBox->id;
            $this->next_review_at = $previousBox->calculateNextReviewDate();
            $this->last_reviewed_at = now();
            $this->save();
        }
    }

    // Sobrescribimos el método recordReview para manejar la constancia
    public function recordReview(bool $remembered)
    {
        $previousBox = $this->leitner_box_id;

        if ($remembered) {
            $this->moveToNextBox();
            $this->consecutive_misses = 0; // Resetear los días perdidos si recuerda
        } else {
            $this->moveToFirstBox();
            // No reseteamos consecutive_misses si no recuerda, para mantener el seguimiento
        }

        ReviewHistory::create([
            'user_id' => $this->user_id,
            'flashcard_id' => $this->id,
            'remembered' => $remembered,
            'previous_box' => $previousBox,
            'new_box' => $this->leitner_box_id,
            'reviewed_at' => now(),
            'days_overdue' => $this->getDaysOverdue() // Agregamos los días de atraso al historial
        ]);
    }
}
