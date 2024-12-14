'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostWithUser } from '@/types/types';

export default function EditPost({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { data: session } = useSession();
	const [post, setPost] = useState<PostWithUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState({
		title: '',
		body: '',
		courseCode: '',
		topics: [] as string[],
	});

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`/api/posts/${params.id}`);
				const data = await response.json();

				if (!response.ok) throw new Error(data.message);

				setPost(data);
				setFormData({
					title: data.title,
					body: data.body,
					courseCode: data.courseCode,
					topics: data.topics,
				});
			} catch (error) {
				console.error('Failed to fetch post:', error);
				router.push('/');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPost();
	}, [params.id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`/api/posts/${params.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (!response.ok) throw new Error('Failed to update post');

			router.push('/');
			router.refresh();
		} catch (error) {
			console.error('Failed to update post:', error);
			alert('Failed to update post');
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (!post) return <div>Post not found</div>;
	if (session?.user?.email !== post.user.email) {
		router.push('/');
		return null;
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Edit Post</h1>

			<div className="space-y-4">
				<div>
					<label className="block mb-1">Title</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Course Code</label>
					<input
						type="text"
						value={formData.courseCode}
						onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Content</label>
					<textarea
						value={formData.body}
						onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
						className="w-full p-2 border rounded min-h-[200px]"
						required
					/>
				</div>

				<button
					type="submit"
					className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
				>
					Update Post
				</button>
			</div>
		</form>
	);
}

// Add Post component
export function AddPost() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: '',
		courseCode: '',
		body: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) throw new Error('Failed to create post');

			router.push('/');
		} catch (error) {
			console.error('Error creating post:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Create New Post</h1>
			<div className="space-y-4">
				<div>
					<label className="block mb-1">Title</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Course Code</label>
					<input
						type="text"
						value={formData.courseCode}
						onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
						className="w-full p-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Content</label>
					<textarea
						value={formData.body}
						onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
						className="w-full p-2 border rounded min-h-[200px]"
						required
					/>
				</div>

				<div className="flex gap-4">
					<button
						type="submit"
						className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
					>
						Create Post
					</button>

					<button
						type="button"
						onClick={() => router.push('/')}
						className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	);
}

// Delete Post functionality
export async function deletePost(postId: string) {
	try {
		const response = await fetch(`/api/posts/${postId}`, {
			method: 'DELETE',
		});

		if (!response.ok) throw new Error('Failed to delete post');

		return true;
	} catch (error) {
		console.error('Error deleting post:', error);
		return false;
	}
}

export default EditPostPage;