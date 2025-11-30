import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    //Breadcrumbs for the top navigation, here it is "posts"
    {
        title: 'Project',
        href: '/posts',
    },
];

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className='container mx-auto p-4'>
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-2xl font-bold'>Projects</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/my-projects"
                            className="text-green-600 hover:underline"
                        >
                            My Projects
                        </Link>
                        <Link
                            href="/posts/create"
                            className="text-blue-500 hover:underline"
                        >
                            Create New Project
                        </Link>
                    </div>
                </div>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full table-auto shadow-lg bg-white dark:bg-neutral-800'>
                    <thead>
                        <tr className='bg-neutral-50 dark:bg-neutral-700'>
                            <th className='px-4 py-2 border-b'>ID</th>
                            <th className='px-4 py-2 border-b'>Title</th>
                            <th className='px-4 py-2 border-b'>Content</th>
                            <th className='px-4 py-2 border-b'>Created</th>
                            <th className='px-4 py-2 border-b'>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
    {posts.map((post) => (
        <tr key={post.id} className='hover:bg-neutral-100 dark:hover:bg-neutral-700'>
            <td className='px-4 py-2 border-b'>{post.id}</td>
            <td className='px-4 py-2 border-b'>{post.title}</td>
            <td className='px-4 py-2 border-b'>{post.content}</td>
            <td className='px-4 py-2 border-b'>{post.created_at}</td>
            <td className='px-4 py-2 border-b'>{post.updated_at}</td>
            <td className='px-4 py-2 border-b'>
                <Link
                    href={`/posts/${post.id}`}
                    className="text-blue-500 hover:underline"
                >
                    View
                </Link>
                <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-blue-500 hover:underline ml-4"
                >
                    Edit
                </Link>
                <Link
                    href={`/posts/${post.id}`}
                    method="delete"
                    as="button"
                    onBefore={() => confirm('Are you sure you want to delete this post?')}
                    className="text-red-500 hover:underline ml-4"
                >
                    Delete
                </Link>
                   <Link
                     href={`/posts/${post.id}/addUser`}
                    className="text-green-600 hover:underline ml-4">
                         Add User
                         </Link>

 


            </td>
        </tr>
    ))}
</tbody>
                </table>
            </div>
        </AppLayout>
    );
}