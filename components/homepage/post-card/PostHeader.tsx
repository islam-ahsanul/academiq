'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
	FaEdit,
	FaTrash,
	FaFlag,
	FaShare,
	FaExpand,
	FaUser,
	FaGraduationCap,
	FaBuilding,
	FaChalkboardTeacher,
	FaIdCard,
	FaWhatsapp,
	FaTwitter,
	FaFacebook,
	FaTelegram,
	FaLink,
} from 'react-icons/fa';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PostWithUser } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PostHeaderProps {
	post: PostWithUser;
	currentUserId?: string;
}

export function PostHeader({ post, currentUserId }: PostHeaderProps) {
	const { toast } = useToast();
	const isAuthor = currentUserId === post.userId;

	const handleShare = async (platform?: string) => {
		const postUrl = `${window.location.origin}/post/${post.id}`;
		const shareText = `Check out this post: ${post.title}`;

		if (!platform && navigator.share) {
			try {
				await navigator.share({
					title: post.title,
					text: shareText,
					url: postUrl,
				});
				return;
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					console.error('Error sharing:', error);
				}
			}
		}

		const shareUrls: Record<string, string> = {
			whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`,
			twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
			telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`,
			copy: postUrl,
		};

		if (platform === 'copy') {
			try {
				await navigator.clipboard.writeText(postUrl);
				toast({
					title: 'Link copied!',
					description: 'Post link has been copied to clipboard',
					duration: 3000,
				});
			} catch (error) {
				toast({
					title: 'Failed to copy link',
					description: 'Please try again',
					variant: 'destructive',
					duration: 3000,
				});
			}
			return;
		}

		const shareUrl = shareUrls[platform || ''];
		if (shareUrl) {
			window.open(shareUrl, '_blank', 'noopener,noreferrer');
		}
	};

	const formatTimeAgo = (date: Date) => {
		const formatted = formatDistanceToNow(date, { addSuffix: true })
			.replace('about ', '')
			.replace(' hours ago', 'h')
			.replace(' hour ago', 'h')
			.replace(' minutes ago', 'min')
			.replace(' minute ago', 'min')
			.replace(' seconds ago', 's ago')
			.replace(' second ago', 's ago')
			.replace(' days ago', 'd')
			.replace(' day ago', 'd')
			.replace(' months ago', 'mon')
			.replace(' month ago', 'mon')
			.replace(' years ago', 'yr')
			.replace(' year ago', 'yr');
		return formatted;
	};

	return (
		<div className="w-full bg-gray-bg p-4">
			<Badge variant="secondary" className="mb-2 rounded-full">
				<span className="uppercase font-bold text-md">{post.courseCode}</span>
			</Badge>
			<div className="flex justify-between items-start mb-2 w-full">
				<div className="flex-1">
					<Link href={`/post/${post.id}`} className="no-underline">
						<h2 className="text-xl font-semibold hover:text-violet-200 transition-all duration-500">{post.title}</h2>
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">{formatTimeAgo(new Date(post.createdAt))}</span>
					<Link href={`/post/${post.id}`}>
						<Button variant="icon" size="icon" className="hover:text-purple-400">
							<FaExpand className="h-4 w-4" />
							<span className="sr-only">View full post</span>
						</Button>
					</Link>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild className="outline-none">
							<Button variant="icon" size="icon" className="hover:text-purple-400">
								<BsThreeDotsVertical className="h-4 w-4" />
								<span className="sr-only">More options</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[200px]">
							{isAuthor && (
								<>
									<DropdownMenuItem className="group text-white cursor-pointer">
										<FaEdit className="h-4 w-4 mr-2 text-white group-hover:text-blue-400 transition-colors" />
										<span className="text-white group-hover:text-blue-400 transition-colors">Edit</span>
									</DropdownMenuItem>
									<DropdownMenuItem className="group text-white cursor-pointer">
										<FaTrash className="h-4 w-4 mr-2 text-white group-hover:text-red-500 transition-colors" />
										<span className="text-white group-hover:text-red-500 transition-colors">Delete</span>
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem className="group text-white cursor-pointer">
								<FaFlag className="h-4 w-4 mr-2 text-white group-hover:text-yellow-500 transition-colors" />
								<span className="text-white group-hover:text-yellow-500 transition-colors">Report</span>
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger className="group text-white cursor-pointer">
									<FaShare className="h-4 w-4 mr-2 text-white group-hover:text-green-400 transition-colors" />
									<span className="text-white group-hover:text-green-400 transition-colors">Share</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuItem onClick={() => handleShare()}>
										<FaShare className="h-4 w-4 mr-2" />
										Share...
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleShare('whatsapp')}>
										<FaWhatsapp className="h-4 w-4 mr-2 text-green-500" />
										WhatsApp
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleShare('twitter')}>
										<FaTwitter className="h-4 w-4 mr-2 text-blue-400" />
										Twitter
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleShare('facebook')}>
										<FaFacebook className="h-4 w-4 mr-2 text-blue-600" />
										Facebook
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleShare('telegram')}>
										<FaTelegram className="h-4 w-4 mr-2 text-blue-500" />
										Telegram
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleShare('copy')}>
										<FaLink className="h-4 w-4 mr-2" />
										Copy Link
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="space-y-1">
				<div className="flex flex-wrap items-center gap-4 text-sm">
					<Link href={`/profile/${post.user.id}`} className="flex items-center gap-2 text-primary hover:underline font-bold">
						<FaUser className="h-4 w-4" />
						{post.user.name}
						{post.user.role === 'FACULTY' && post.user.facultyInitials && (
							<span className="text-muted-foreground">({post.user.facultyInitials})</span>
						)}
					</Link>
					{post.user.role && (
						<span className="flex items-center gap-2 text-muted-foreground">
							{post.user.role === 'STUDENT' ? <FaGraduationCap className="h-4 w-4" /> : <FaChalkboardTeacher className="h-4 w-4" />}
							{post.user.role.charAt(0).toUpperCase() + post.user.role.slice(1).toLowerCase()}
						</span>
					)}
					{post.user.department && (
						<span className="flex items-center gap-2 text-muted-foreground">
							<FaBuilding className="h-4 w-4" />
							{post.user.department}
						</span>
					)}
					{post.user.role === 'FACULTY' && post.user.facultyPosition && (
						<span className="flex items-center gap-2 text-muted-foreground">
							<FaIdCard className="h-4 w-4" />
							{post.user.facultyPosition}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
