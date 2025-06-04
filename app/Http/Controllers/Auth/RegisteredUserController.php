<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Initialize Leitner boxes for the new user
        $defaultBoxes = [
            ['name' => 'Diario', 'box_number' => 1, 'review_interval' => 1],
            ['name' => 'Cada 3 días', 'box_number' => 2, 'review_interval' => 3],
            ['name' => 'Semanal', 'box_number' => 3, 'review_interval' => 7],
            ['name' => 'Quincenal', 'box_number' => 4, 'review_interval' => 14],
            ['name' => 'Mensual', 'box_number' => 5, 'review_interval' => 30],
        ];

        foreach ($defaultBoxes as $box) {
            $user->leitnerBoxes()->create([
                'name' => $box['name'],
                'box_number' => $box['box_number'],
                'review_interval' => $box['review_interval']
            ]);
        }

        return to_route('dashboard');
    }
}
