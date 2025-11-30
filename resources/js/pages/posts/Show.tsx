import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon, PlusIcon } from 'lucide-react';
import { Head, Link, usePage, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/posts',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    user: User;
    created_at: string;
    updated_at: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: User;
    created_at: string;
    updated_at: string;
}

interface ShowProjectProps {
    post: Post;
    tasks: Task[];
    assignedUsers: User[];
}

export default function ShowProject({ post, tasks, assignedUsers }: ShowProjectProps) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in_progress':
                return 'In Progress';
            default:
                return 'Pending';
        }
    };

    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
    const completedTasks = tasks.filter((t) => t.status === 'completed');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="container mx-auto p-4">
                {flash?.success && (
                    <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                        <CheckCircleIcon className="text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Created by {post.user.name} • {post.created_at}
                            </p>
                        </div>
                        <Link
                            href={`/posts/${post.id}/tasks/create`}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <PlusIcon className="size-4" />
                            Add Task
                        </Link>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 mb-4">
                        <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>

                    {assignedUsers.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                                Assigned Users:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {assignedUsers.map((user) => (
                                    <span
                                        key={user.id}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                    >
                                        {user.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-4">Tasks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {pendingTasks.length}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                Pending
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {inProgressTasks.length}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                In Progress
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {completedTasks.length}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                Completed
                            </div>
                        </div>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 text-center">
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-4">
                            No tasks yet. Create your first task!
                        </p>
                        <Link
                            href={`/posts/${post.id}/tasks/create`}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <PlusIcon className="size-4" />
                            Add Task
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                                {task.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                            <span>Created by {task.user.name}</span>
                                            <span>•</span>
                                            <span>{task.created_at}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                task.status,
                                            )}`}
                                        >
                                            {getStatusLabel(task.status)}
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/posts/${post.id}/tasks/${task.id}/edit`}
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Are you sure you want to delete this task?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/posts/${post.id}/tasks/${task.id}`,
                                                        );
                                                    }
                                                }}
                                                className="text-red-500 hover:underline text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

