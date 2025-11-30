<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    // Shows all posts
    public function index()
    {
        // Gets latest posts and formats the data before sending
        $posts = Post::latest()->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'created_at' => $post->created_at->diffForHumans(), // Shows 2 hours ago style time

            ];
        });

        return inertia('posts/index', [
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return inertia::render('posts/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'max:255'],
            'content' => ['required'],
        ]);
        // Creates a new post record
        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('posts.index');
    }

    public function edit(Post $post)
    {
        return inertia::render('posts/Edit', [
            'post' => $post,
        ]);
    }

    // Updates an existing post
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => ['required', 'max:255'],
            'content' => ['required'],
        ]);

        $post->update($request->all());

        return redirect()->route('posts.index');
    }

    // Deletes a post
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }

    public function addUser(Post $post)
    {
        // Eager load users relationship to avoid N+1 queries
        $post->load('users');

        // Get the authenticated user
        $authenticatedUserId = auth()->id();

        // Get all users
        $allUsers = \App\Models\User::select('id', 'name', 'email')->get();

        // Get users already attached to this post
        $attachedUserIds = $post->users->pluck('id')->toArray();

        // Filter out users that are already attached AND the authenticated user
        $availableUsers = $allUsers->reject(function ($user) use ($attachedUserIds, $authenticatedUserId) {
            return in_array($user->id, $attachedUserIds) || $user->id === $authenticatedUserId;
        });

        // Get attached users for display
        $attachedUsers = $post->users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
        });

        return Inertia::render('posts/addUser', [
            'post' => $post,
            'users' => $availableUsers->values(),
            'attachedUsers' => $attachedUsers,
        ]);
    }

    public function assignUser(Request $request, Post $post)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = \App\Models\User::find($request->user_id);

        // attach the user if not already attached
        if (! $post->users->contains($user->id)) {
            $post->users()->attach($user->id);
        }

        return redirect()->route('posts.addUser', $post)->with('success', $user->name.' is added to the project');
    }

    /**
     * Show all projects the authenticated user created or is added to.
     */
    public function myProjects()
    {
        $user = auth()->user();

        // Get projects created by the user
        $createdProjects = Post::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'created_at' => $post->created_at->diffForHumans(),
                    'updated_at' => $post->updated_at->diffForHumans(),
                    'type' => 'created',
                ];
            });

        // Get projects where the user is added (via pivot table)
        $assignedProjects = $user->addedPosts()
            ->latest()
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'created_at' => $post->created_at->diffForHumans(),
                    'updated_at' => $post->updated_at->diffForHumans(),
                    'type' => 'assigned',
                ];
            });

        // Merge and sort by updated_at
        $allProjects = $createdProjects->concat($assignedProjects)
            ->sortByDesc('updated_at')
            ->values();

        return Inertia::render('posts/MyProjects', [
            'projects' => $allProjects,
        ]);
    }

    /**
     * Display the specified project with its tasks.
     */
    public function show(Post $post)
    {
        // Check if user has access to this project (owner or assigned)
        $user = auth()->user();
        $hasAccess = $post->user_id === $user->id || $post->users->contains($user->id);

        if (! $hasAccess) {
            abort(403, 'You do not have access to this project.');
        }

        // Eager load relationships
        $post->load(['tasks.user', 'user', 'users']);

        $tasks = $post->tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'user' => [
                    'id' => $task->user->id,
                    'name' => $task->user->name,
                    'email' => $task->user->email,
                ],
                'created_at' => $task->created_at->diffForHumans(),
                'updated_at' => $task->updated_at->diffForHumans(),
            ];
        });

        return Inertia::render('posts/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'email' => $post->user->email,
                ],
                'created_at' => $post->created_at->diffForHumans(),
                'updated_at' => $post->updated_at->diffForHumans(),
            ],
            'tasks' => $tasks,
            'assignedUsers' => $post->users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ];
            }),
        ]);
    }
}
