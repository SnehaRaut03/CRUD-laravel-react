import { assignUser } from '@/actions/App/Http/Controllers/PostController';
import AppLayout from '@/layouts/app-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon } from 'lucide-react';
import { Head, useForm, usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AddUserProps {
  post: { id: number; title: string };
  users: User[];
  attachedUsers: User[];
}

export default function AddUser({ post, users, attachedUsers }: AddUserProps) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;
    const { data, setData, post: submitForm, processing, errors, reset } = useForm({
        user_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.user_id) return;

        submitForm(assignUser.url({ post: post.id }), {
            method: 'post',
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Add User" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">
                    Add User to: {post.title}
                </h1>

                {flash?.success && (
                    <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                        <CheckCircleIcon className="text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {attachedUsers.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Users in this project:</h2>
                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                            <ul className="space-y-2">
                                {attachedUsers.map((user) => (
                                    <li key={user.id} className="flex items-center gap-2">
                                        <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" />
                                        <span className="text-neutral-700 dark:text-neutral-300">
                                            {user.name} ({user.email})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {users.length === 0 ? (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-blue-800 dark:text-blue-200">
                            All available users have been added to this project.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                                Select a user to add:
                            </label>
                            <select
                                id="user_id"
                                name="user_id"
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">Select a user</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errors.user_id && (
                            <div className="text-sm text-red-600 dark:text-red-400">
                                {errors.user_id}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !data.user_id}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Adding...' : 'Add User'}
                        </button>
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
