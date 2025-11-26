import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head,Link, useForm } from '@inertiajs/react';
// import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Post',
        href: '/posts/Create',
    },
]

    export default function CreatePost() {


        const { data, setData, post, processing, errors,reset } = useForm({
            title: '',
            content: '',
        });
    
        const submit = (e: React.FormEvent) => {  // When user submits the form
            e.preventDefault();
            // Sends POST request to backend to create a new post
            post('/posts', {
                onSuccess: () => {
                    reset(); //Clears the form after success
                },
            });
        };
    



        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Post" />
                <div className='container mx-auto p-4'>
                    <div className='max-w-md mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md'>
                        <h1 className='text-2xl font-bold mb-4'>Create New Post</h1>
                        <Link href="/posts" className="text-blue-500 hover:underline mb-4 inline-block">Back to Posts</Link>
                        
                        <form onSubmit={submit} method="POST">
                            <div className='mb-4'>
                                <label htmlFor='title' className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Title</label>
                                <input type='text' id='title' name='title' 
                                value={data.title}
                                onChange={(e) => setData('title', e.currentTarget.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' required />
                            </div>
                            
                            <div className='mb-4'>
                                <label htmlFor='content' className='block text-gray-700 dark:text-gray-300 font-bold mb-2'>Content</label>
                                <textarea id='content' name='content' rows={5} 
                                value={data.content}
                                onChange={(e) => setData('content', e.currentTarget.value)}                                                             
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' required></textarea>
                            </div>
                            
                            <div className='mb-4'>
                                <button type='submit' className='bg-blue-500 
                                text-white px-4 py-2 rounded-md 
                                hover:bg-blue-600 transition'>
                                    {processing ? 'Creating...' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>         
        );
    }