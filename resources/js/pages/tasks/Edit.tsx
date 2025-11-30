import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Post {
    id: number;
    title: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
}

interface EditTaskProps {
    post: Post;
    task: Task;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/posts',
    },
];

export default function EditTask({ post, task }: EditTaskProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/posts/${post.id}/tasks/${task.id}`, {
            method: 'put',
            onSuccess: () => {
                // Redirect handled by controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />
            <div className="container mx-auto p-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

                    <Link
                        href={`/posts/${post.id}`}
                        className="text-blue-500 hover:underline mb-4 inline-block"
                    >
                        ← Back to Project
                    </Link>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                className="mt-1"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <Label htmlFor="status">Status *</Label>
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                required
                                className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Task'}
                            </Button>
                            <Link
                                href={`/posts/${post.id}`}
                                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

