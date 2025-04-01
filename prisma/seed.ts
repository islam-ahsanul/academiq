import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	// Create users
	const hashedPassword = bcrypt.hashSync('password123', 10);

	const admin = await prisma.user.upsert({
		where: { email: 'admin@test.com' },
		update: {},
		create: {
			email: 'admin@test.com',
			name: 'Admin User',
			hashedPassword,
			role: 'ADMIN',
			department: 'Administration',
		},
	});

	const faculty = await prisma.user.upsert({
		where: { email: 'faculty@test.com' },
		update: {},
		create: {
			email: 'faculty@test.com',
			name: 'Faculty User',
			hashedPassword,
			role: 'FACULTY',
			facultyInitials: 'DR',
			facultyPosition: 'Professor',
			department: 'Computer Science',
		},
	});

	const student = await prisma.user.upsert({
		where: { email: 'student@test.com' },
		update: {},
		create: {
			email: 'student@test.com',
			name: 'Student User',
			hashedPassword,
			role: 'STUDENT',
			department: 'Computer Science',
			studentId: '2020-1-60-001',
		},
	});

	// Create posts
	const post1 = await prisma.post.create({
		data: {
			title: 'Introduction to Programming',
			body: 'Learn the basics of programming with Python',
			courseCode: 'CSE101',
			topics: ['programming', 'python', 'basics'],
			hasLink: false,
			hasMaterial: false,
			userId: faculty.id,
		},
	});

	const post2 = await prisma.post.create({
		data: {
			title: 'Data Structures Notes',
			body: 'Complete notes on Arrays, Linked Lists, and Trees',
			courseCode: 'CSE201',
			topics: ['data structures', 'algorithms', 'notes'],
			hasLink: true,
			hasMaterial: true,
			materials: ['https://example.com/notes.pdf'],
			userId: faculty.id,
		},
	});

	// Create comments
	await prisma.comment.create({
		data: {
			body: 'Great explanation! Very helpful.',
			userId: student.id,
			postId: post1.id,
		},
	});

	// Create votes
	await prisma.postVote.create({
		data: {
			value: 1,
			userId: student.id,
			postId: post1.id,
		},
	});

	// Create bookmarks
	await prisma.bookmark.create({
		data: {
			userId: student.id,
			postId: post2.id,
		},
	});

	console.log('Seeding completed');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
