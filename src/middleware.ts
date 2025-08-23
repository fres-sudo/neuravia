import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";

const publicRoutes = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow public routes
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next();
	}

	// Check authentication
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	// If not authenticated, redirect to login
	if (!session?.user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
