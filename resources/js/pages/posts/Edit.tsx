import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Post',
        href: '/posts/Edit',
    },
];

interface Post {
    id: number;
    title: string;
    content: string;
}

interface EditPostProps {
    post: Post;
}

export default function EditPost({ post }: EditPostProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: post.title,  // Fixed typo: was post.tile
        content: post.content,
    });

    // When user submits the form
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Sends PUT request to update the post
        put(`/posts/${post.id}`, {
            onSuccess: () => {
                reset(); // Clears form after success
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Post" />
            <div className='container mx-auto p-4'>
                <div className='max-w-md mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md'>
                    <h1 className='text-2xl font-bold mb-4'>Edit Post</h1>
                    <Link href="/posts" className="text-blue-500 hover:underline mb-4 inline-block">Back to Posts</Link>
                    
                    <form onSubmit={submit}>
                        <div className='mb-4'>
                            <label htmlFor='title' className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Title</label>
                            <input 
                                type='text' 
                                id='title' 
                                name='title' 
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' 
                                required 
                            />
                            {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
                        </div>
                        
                        <div className='mb-4'>
                            <label htmlFor='content' className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Content</label>
                            <textarea 
                                id='content' 
                                name='content' 
                                rows={5} 
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}                                                             
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' 
                                required
                            ></textarea>
                            {errors.content && <p className='text-red-500 text-sm mt-1'>{errors.content}</p>}
                        </div>
                        
                        <div className='mb-4'>
                            <button 
                                type='submit' 
                                disabled={processing}
                                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50'
                            >
                                {processing ? 'Updating...' : 'Update Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>         
    );
}