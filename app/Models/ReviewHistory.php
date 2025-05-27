<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewHistory extends Model
{
    protected $table = 'review_history';

    protected $fillable = [
        'user_id',
        'flashcard_id',
        'remembered',
        'previous_box',
        'new_box',
        'reviewed_at'
    ];

    protected $casts = [
        'remembered' => 'boolean',
        'reviewed_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function flashcard(): BelongsTo
    {
        return $this->belongsTo(Flashcard::class);
    }
}
