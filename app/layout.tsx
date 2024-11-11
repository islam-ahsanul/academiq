import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'AcademiQ',
	description: 'AcademiQ',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>{children}</body>
			</html>
		</SessionProvider>
	);
}
