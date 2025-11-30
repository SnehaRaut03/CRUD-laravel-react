<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TaskController;

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
    Route::get('/posts/{post}/addUser', [PostController::class, 'addUser'])
        ->name('posts.addUser');

  
    Route::post('/posts/{post}/assign-user', [PostController::class, 'assignUser'])
        ->name('posts.assignUser');

    Route::get('/my-projects', [PostController::class, 'myProjects'])
        ->name('posts.myProjects');

    // Task routes
    Route::get('/posts/{post}/tasks/create', [TaskController::class, 'create'])
        ->name('tasks.create');
    Route::post('/posts/{post}/tasks', [TaskController::class, 'store'])
        ->name('tasks.store');
    Route::get('/posts/{post}/tasks/{task}/edit', [TaskController::class, 'edit'])
        ->name('tasks.edit');
    Route::put('/posts/{post}/tasks/{task}', [TaskController::class, 'update'])
        ->name('tasks.update');
    Route::delete('/posts/{post}/tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');
});

Route::resource('posts', PostController::class)->middleware('auth');

require __DIR__.'/settings.php'; 