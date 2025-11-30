import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Projects',
        href: '/my-projects',
    },
];

interface Project {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    type?: 'created' | 'assigned';
}

interface MyProjectsProps {
    projects: Project[];
}

export default function MyProjects({ projects }: MyProjectsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Projects" />
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">My Projects</h1>
                    <Link
                        href="/posts"
                        className="text-blue-500 hover:underline"
                    >
                        All Projects
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-8 text-center">
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                            You haven't been added to any projects yet.
                        </p>
                        <Link
                            href="/posts"
                            className="text-blue-500 hover:underline mt-4 inline-block"
                        >
                            Browse all projects
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow-lg bg-white dark:bg-neutral-800">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-700">
                                    <th className="px-4 py-2 border-b">ID</th>
                                    <th className="px-4 py-2 border-b">Title</th>
                                    <th className="px-4 py-2 border-b">Content</th>
                                    <th className="px-4 py-2 border-b">Type</th>
                                    <th className="px-4 py-2 border-b">Created</th>
                                    <th className="px-4 py-2 border-b">Updated</th>
                                    <th className="px-4 py-2 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                    >
                                        <td className="px-4 py-2 border-b">
                                            {project.id}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {project.title}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {project.content}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${
                                                    project.type === 'created'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                }`}
                                            >
                                                {project.type === 'created' ? 'Created' : 'Assigned'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {project.created_at}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            {project.updated_at}
                                        </td>
                                        <td className="px-4 py-2 border-b">
                                            <Link
                                                href={`/posts/${project.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

