<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PostController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
// only logged-in and verified users can access
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
// CRUD routes for posts (index, create, store, edit, update, delete)
// All these require user to be logged in
Route::resource ('posts', PostController::class)->middleware('auth');

require __DIR__.'/settings.php'; 