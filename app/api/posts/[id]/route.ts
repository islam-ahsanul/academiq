import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const post = await prisma.post.findUnique({
			where: { id: params.id },
			include: { user: true },
		});

		if (!post) {
			return NextResponse.json({ message: 'Post not found' }, { status: 404 });
		}

		if (post.user.email !== session.user.email) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const body = await request.json();
		const updatedPost = await prisma.post.update({
			where: { id: params.id },
			data: {
				title: body.title,
				body: body.body,
				courseCode: body.courseCode,
				topics: body.topics,
			},
		});

		return NextResponse.json(updatedPost);
	} catch (error) {
		console.error('Failed to update post:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const post = await prisma.post.findUnique({
			where: { id: params.id },
			include: { user: true },
		});

		if (!post) {
			return NextResponse.json({ message: 'Post not found' }, { status: 404 });
		}

		if (post.user.email !== session.user.email) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		await prisma.post.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ message: 'Post deleted successfully' });
	} catch (error) {
		console.error('Failed to delete post:', error);
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
} 