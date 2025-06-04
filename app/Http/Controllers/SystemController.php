<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemController extends Controller
{
    public function advanceDay()
    {
        // Get or initialize the current offset
        $currentOffset = Cache::get('date_offset', 0);
        
        // Increment the offset by 1 day
        Cache::put('date_offset', $currentOffset + 1);

        return to_route('dashboard');
    }

    public function resetDate()
    {
        // Reset the date offset to 0
        Cache::put('date_offset', 0);

        return to_route('dashboard');
    }

    public function getCurrentDate()
    {
        $offset = Cache::get('date_offset', 0);
        return now()->addDays($offset)->format('Y-m-d');
    }
} 