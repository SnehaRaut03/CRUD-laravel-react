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
        $posts = Post::latest ()->get()->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'created_at'=> $post->created_at->diffForHumans(), //Shows 2 hours ago style time
                
            ];
        });
        return inertia('posts/index', [
            'posts' =>$posts,
        ]);
    }
    public function create()
    {
        return inertia::render('posts/Create');
    }

    public function store(Request $request)
    {
           $request->validate([
            'title' => ['required','max:255'],
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

    public function edit (Post $post)
    {
        return inertia::render('posts/Edit', [
            'post' => $post,
        ]);
    }
     // Updates an existing post
    public function update (Request $request, Post $post)
    {
        $request->validate([
            'title' => ['required','max:255'],
            'content' => ['required'],
        ]);

        $post->update($request->all());

        return redirect()->route('posts.index');
    }
    //Deletes a post
    public function destroy (Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index');
    }
}
