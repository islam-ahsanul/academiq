import { Button } from '@/components/ui/button';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';

export function PostActions() {
	return (
		<div className="flex items-center justify-between gap-4 mt-4 border-t pt-3 px-4">
			<div className="flex items-center gap-4">
				<VoteButtons />
				<CommentButton />
			</div>
			<BookmarkButton />
		</div>
	);
}

function VoteButtons() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="icon" size="icon" className="hover:text-green-400">
				<BiUpvote className="h-5 w-5 stroke-[1.5] stroke-white" />
			</Button>
			<span className="text-sm font-medium min-w-[2ch] text-center">{0}</span>
			<Button variant="icon" size="icon" className="hover:text-red-400">
				<BiDownvote className="h-5 w-5 stroke-[1.5] stroke-white" />
			</Button>
		</div>
	);
}

function CommentButton() {
	return (
		<div className="flex items-center gap-1">
			<Button variant="icon" size="icon" className="hover:text-purple-400">
				<FaRegComment className="h-4 w-4" />
			</Button>
			<span className="text-sm font-medium">{0}</span>
		</div>
	);
}

function BookmarkButton() {
	return (
		<div className="group relative">
			<Button variant="icon" size="icon" className="hover:text-yellow-400">
				<FaRegBookmark className="h-4 w-4" />
			</Button>
			<span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
				Bookmark post
			</span>
		</div>
	);
}
