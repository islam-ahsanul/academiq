import { PostWithUser } from '@/types/types';
import { PostHeader } from './post-card/PostHeader';
import { PostActions } from './post-card/PostActions';
import { Badge } from '../ui/badge';
import { FaFileAlt } from 'react-icons/fa';

interface PostCardProps {
	post: PostWithUser;
	currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
	return (
		<div className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
			<PostHeader post={post} currentUserId={currentUserId} />

			<div className="flex-1 flex flex-col px-4">
				<p className="text-sm text-foreground my-3 line-clamp-2">{post.body}</p>

				{post.materials && post.materials.length > 0 && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
						<FaFileAlt className="h-4 w-4" />
						<span>
							{post.materials.length} attachment{post.materials.length > 1 ? 's' : ''}
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-2 mb-3 mt-auto px-4">
				{post.topics.map((topic, index) => (
					<Badge key={index} variant="dark" className="text-xs rounded-full text-muted-foreground">
						{topic}
					</Badge>
				))}
			</div>

			<PostActions postId={post.id} commentCount={post._count?.comments || 0} currentUserId={currentUserId} />
		</div>
	);
}
