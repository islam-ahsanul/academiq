'use client';

import { Button } from '@/components/ui/button';
import { BiSolidUpvote, BiSolidDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import Link from 'next/link';

interface PostActionsProps {
	postId: string;
	commentCount: number;
	currentUserId?: string;
}

interface VoteResponse {
	upvotes: number;
	downvotes: number;
}

interface VoteContext {
	previousVote: number;
	previousUpvotes: number;
	previousDownvotes: number;
}

export function PostActions({ postId, commentCount, currentUserId }: PostActionsProps) {
	const [userVote, setUserVote] = useState<number>(0);
	const [upvotes, setUpvotes] = useState<number>(0);
	const [downvotes, setDownvotes] = useState<number>(0);
	const [isVoting, setIsVoting] = useState<boolean>(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isBookmarking, setIsBookmarking] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		if (currentUserId) {
			fetchVotes();
			checkBookmarkStatus();
		}
	}, [postId, currentUserId]);

	const fetchVotes = async () => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/vote`);
			if (!response.ok) throw new Error('Failed to fetch votes');
			const data = await response.json();
			setUserVote(data.userVote);
			setUpvotes(data.upvotes);
			setDownvotes(data.downvotes);
		} catch (error) {
			console.error('Error fetching votes:', error);
		}
	};

	const submitVote = async (value: number): Promise<VoteResponse> => {
		const response = await fetch(`/api/get-posts/${postId}/vote`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value }),
		});
		if (!response.ok) throw new Error('Failed to vote');
		return response.json();
	};

	const handleOptimisticUpdate = (value: number): VoteContext => {
		const previousVote = userVote;
		const previousUpvotes = upvotes;
		const previousDownvotes = downvotes;

		if (value === previousVote) {
			setUserVote(0);
			setUpvotes(value === 1 ? upvotes - 1 : upvotes);
			setDownvotes(value === -1 ? downvotes - 1 : downvotes);
		} else {
			setUserVote(value);
			if (value === 1) {
				setUpvotes(upvotes + 1);
				if (previousVote === -1) setDownvotes(downvotes - 1);
			} else {
				setDownvotes(downvotes + 1);
				if (previousVote === 1) setUpvotes(upvotes - 1);
			}
		}

		return { previousVote, previousUpvotes, previousDownvotes };
	};

	const handleError = (context: VoteContext) => {
		setUserVote(context.previousVote);
		setUpvotes(context.previousUpvotes);
		setDownvotes(context.previousDownvotes);
		toast({
			title: 'Error',
			description: 'Failed to process vote',
			variant: 'destructive',
		});
	};

	const debouncedVote = useCallback(
		debounce(async (value: number) => {
			if (!isVoting) {
				setIsVoting(true);
				const context = handleOptimisticUpdate(value);
				try {
					const result = await submitVote(value);
					setUpvotes(result.upvotes);
					setDownvotes(result.downvotes);
				} catch (error) {
					handleError(context);
				} finally {
					setIsVoting(false);
				}
			}
		}, 300),
		[isVoting, userVote, upvotes, downvotes],
	);

	const handleVote = (value: number) => {
		if (!currentUserId) {
			toast({
				title: 'Authentication required',
				description: 'Please login to vote',
				variant: 'destructive',
			});
			return;
		}
		debouncedVote(value);
	};

	const checkBookmarkStatus = async () => {
		try {
			const response = await fetch(`/api/get-posts/${postId}/bookmark`);
			if (!response.ok) throw new Error('Failed to fetch bookmark status');
			const data = await response.json();
			setIsBookmarked(data.bookmarked);
		} catch (error) {
			console.error('Error fetching bookmark status:', error);
		}
	};

	const handleBookmark = async () => {
		if (!currentUserId) {
			toast({
				title: 'Authentication required',
				description: 'Please login to bookmark posts',
				variant: 'destructive',
			});
			return;
		}

		if (isBookmarking) return;

		setIsBookmarking(true);
		const previousState = isBookmarked;
		setIsBookmarked(!isBookmarked);

		try {
			const response = await fetch(`/api/get-posts/${postId}/bookmark`, {
				method: 'POST',
			});

			if (!response.ok) throw new Error('Failed to bookmark');

			const data = await response.json();
			setIsBookmarked(data.bookmarked);
		} catch (error) {
			setIsBookmarked(previousState);
			toast({
				title: 'Error',
				description: 'Failed to bookmark post',
				variant: 'destructive',
			});
		} finally {
			setIsBookmarking(false);
		}
	};

	return (
		<div className="flex items-center justify-between px-4 py-2">
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					className={`hover:text-green-400 ${userVote === 1 ? 'text-green-400' : ''}`}
					onClick={() => handleVote(1)}
					disabled={isVoting}
				>
					<BiSolidUpvote className="h-4 w-4" />
					<span className="ml-1 text-xs">{upvotes}</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={`hover:text-red-400 ${userVote === -1 ? 'text-red-400' : ''}`}
					onClick={() => handleVote(-1)}
					disabled={isVoting}
				>
					<BiSolidDownvote className="h-4 w-4" />
					<span className="ml-1 text-xs">{downvotes}</span>
				</Button>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" className="hover:text-primary">
					<Link href={`/post/${postId}/#comment-section`} className="flex items-center justify-center gap-1">
						<FaRegComment className="h-4 w-4" />
						<span className="ml-1 text-xs">{commentCount}</span>
					</Link>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={`hover:text-primary ${isBookmarked ? 'text-primary' : ''}`}
					onClick={handleBookmark}
					disabled={isBookmarking}
				>
					{isBookmarked ? <FaBookmark className="h-4 w-4" /> : <FaRegBookmark className="h-4 w-4" />}
				</Button>
			</div>
		</div>
	);
}
