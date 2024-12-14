'use client';

import { useState, useEffect } from 'react';
import { PostWithUser } from '@/types/types';
import PostCard from '@/components/homepage/PostCard';

export default function HomePage() {
	const [posts, setPosts] = useState<PostWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch('/api/posts');
				if (!response.ok) throw new Error('Failed to fetch posts');
				const data = await response.json();
				setPosts(data);
			} catch (error) {
				console.error('Error fetching posts:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPosts();
	}, []);

	const handleDelete = async (postId: string) => {
		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE',
			});

			if (!response.ok) throw new Error('Failed to delete post');

			// Remove the deleted post from the state
			setPosts(posts.filter(post => post.id !== postId));
		} catch (error) {
			console.error('Failed to delete post:', error);
			throw error;
		}
	};

	if (isLoading) {
		return <div>Loading posts...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-4">
			{posts.length === 0 ? (
				<div className="text-center text-gray-500">No posts found</div>
			) : (
				posts.map((post) => (
					<PostCard
						key={post.id}
						post={post}
						onDelete={handleDelete}
					/>
				))
			)}
		</div>
	);
} 