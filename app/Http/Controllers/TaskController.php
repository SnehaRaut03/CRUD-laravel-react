<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Show the form for creating a new task.
     */
    public function create(Post $post)
    {
        // Check if user has access to this project (owner or assigned)
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        return Inertia::render('tasks/Create', [
            'post' => $post,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request, Post $post)
    {
        // Check if user has access to this project
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        $request->validate([
            'title' => ['required', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'post_id' => $post->id,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('posts.show', $post)->with('success', 'Task created successfully.');
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Post $post, Task $task)
    {
        // Check if task belongs to the post
        if ($task->post_id !== $post->id) {
            abort(404);
        }

        // Check if user has access to this project
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        return Inertia::render('tasks/Edit', [
            'post' => $post,
            'task' => $task,
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Post $post, Task $task)
    {
        // Check if task belongs to the post
        if ($task->post_id !== $post->id) {
            abort(404);
        }

        // Check if user has access to this project
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        $request->validate([
            'title' => ['required', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        $task->update($request->all());

        return redirect()->route('posts.show', $post)->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Post $post, Task $task)
    {
        // Check if task belongs to the post
        if ($task->post_id !== $post->id) {
            abort(404);
        }

        // Check if user has access to this project
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        $task->delete();

        return redirect()->route('posts.show', $post)->with('success', 'Task deleted successfully.');
    }
}
