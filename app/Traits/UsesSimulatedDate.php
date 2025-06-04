<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

trait UsesSimulatedDate
{
    protected function now()
    {
        $offset = Cache::get('date_offset', 0);
        return Carbon::now()->addDays($offset);
    }
} 