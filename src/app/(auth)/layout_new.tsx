import React from "react";
import { Brain } from "lucide-react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5"
		viewBox="0 0 48 48">
		<path
			fill="#FFC107"
			d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
		/>
		<path
			fill="#FF3D00"
			d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
		/>
		<path
			fill="#4CAF50"
			d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
		/>
		<path
			fill="#1976D2"
			d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
		/>
	</svg>
);

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex h-[100dvh] w-[100dvw] flex-col bg-background font-geist text-foreground md:flex-row">
			{/* Left column: form content */}
			<section className="flex flex-1 flex-col p-8">
				<div className="mb-8">
					<div className="flex items-center">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
							<Brain className="w-5 h-5 text-white" />
						</div>
						<span className="ml-2 font-bold text-xl">Boost</span>
					</div>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-md">
						{/* Children (login-form or register-form) will be rendered here */}
						{children}
					</div>
				</div>
			</section>

			{/* Right column: hero image */}
			<section className="relative hidden flex-1 p-4 md:block">
				<div
					className="absolute inset-4 animate-delay-300 animate-slide-right rounded-3xl bg-center bg-cover"
					style={{
						backgroundImage:
							"url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)",
					}}
				/>
			</section>
		</div>
	);
}

export { GoogleIcon };
