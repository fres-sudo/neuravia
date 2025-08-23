import * as React from "react";
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

// --- TYPE DEFINITIONS ---

interface AuthLayoutProps {
	children: React.ReactNode;
}

// --- MAIN COMPONENT ---

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

			{/* Right column: hero image with BOOST logo */}
			<section className="relative hidden flex-1 p-4 md:block">
				<div
					className="absolute inset-4 animate-delay-300 animate-slide-right rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-green-600 flex items-center justify-center"
					style={{
						backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #16a34a 100%)",
						backgroundSize: "400% 400%",
						animation: "gradient-shift 8s ease-in-out infinite"
					}}
				>
					{/* Large BOOST logo in the center */}
					<div className="flex flex-col items-center justify-center text-white z-10">
						<div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-2xl">
							<Brain className="w-20 h-20 text-white drop-shadow-lg" />
						</div>
						<h1 className="text-6xl font-bold tracking-tight drop-shadow-lg">BOOST</h1>
						<p className="text-xl font-light mt-2 opacity-90 text-center max-w-sm">
							Independence means closeness
						</p>
					</div>
					
					{/* Overlay pattern for visual interest */}
					<div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-3xl"></div>
					
					{/* Floating elements for visual appeal */}
					<div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse"></div>
					<div className="absolute top-20 right-16 w-12 h-12 bg-white/15 rounded-full blur-sm animate-pulse delay-1000"></div>
					<div className="absolute bottom-16 left-12 w-20 h-20 bg-white/8 rounded-full blur-lg animate-pulse delay-2000"></div>
					<div className="absolute bottom-8 right-8 w-14 h-14 bg-white/12 rounded-full blur-md animate-pulse delay-500"></div>
				</div>
			</section>
		</div>
	);
}

export { GoogleIcon };
