import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
	const isAuth = !!req.auth;
	const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

	if (isAuthPage) {
		if (isAuth) {
			return Response.redirect(new URL('/', req.url));
		}
		return NextResponse.next();
	}

	if (!isAuth && req.nextUrl.pathname.startsWith('/profile')) {
		return Response.redirect(new URL('/login', req.url));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ['/profile/:path*', '/create-post/:path*', '/login', '/signup'],
};
