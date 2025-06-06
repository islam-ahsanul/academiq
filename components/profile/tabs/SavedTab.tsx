'use client';

import { useEffect, useState } from 'react';
import { PostWithUser } from '@/types/types';
import PostCard from '@/components/homepage/PostCard';
import { PostCardSkeleton } from '@/components/common/PostCardSkeleton';

interface SavedTabProps {
	userId: string;
}

export const SavedTab = ({ userId }: SavedTabProps) => {
	const [savedPosts, setSavedPosts] = useState<PostWithUser[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSavedPosts = async () => {
			try {
				const response = await fetch(`/api/users/${userId}/bookmarks`);
				if (!response.ok) {
					throw new Error('Failed to fetch bookmarks');
				}
				const data = await response.json();
				setSavedPosts(data);
			} catch (error) {
				console.error('Error fetching bookmarks:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchSavedPosts();
	}, [userId]);

	if (loading)
		return (
			<div className="grid gap-4 grid-cols-1">
				<PostCardSkeleton />
				<PostCardSkeleton />
				<PostCardSkeleton />
			</div>
		);

	return (
		<div className="grid gap-4 grid-cols-1">
			{savedPosts.length === 0 ? (
				<p className="text-muted-foreground col-span-full text-center">No saved posts</p>
			) : (
				savedPosts.map((post) => <PostCard key={post.id} post={post} currentUserId={userId} />)
			)}
		</div>
	);
};
