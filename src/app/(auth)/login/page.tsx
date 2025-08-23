"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { GoogleIcon } from "../layout";
import { authClient } from "@/server/auth/auth-client";

const loginSchema = z.object({
	email: z.email("Enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must contain at least 6 characters"),
	rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
				rememberMe: data.rememberMe,
				callbackURL: "/dashboard",
			});

			if (result.error) {
				setError(result.error.message || "An error occurred during login");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			const result = await authClient.signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});

			if (result.error) {
				setError(result.error.message || "Google login failed");
			}
		} catch (error) {
			console.error("Google sign in error:", error);
			setError("An error occurred during Google login");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = () => {
		alert("The password reset feature will be implemented here");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="animate-element animate-delay-100">
				<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
					<span className="font-light text-foreground tracking-tighter">
						Welcome back
					</span>
				</h1>
				<p className="text-muted-foreground mt-2">
					Log in to your account and continue your journey with us
				</p>
			</div>

			<Form {...form}>
				<form
					className="space-y-5"
					onSubmit={form.handleSubmit(onSubmit)}>
					{error && (
						<Alert
							variant="destructive"
							className="animate-element animate-delay-300">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="animate-element animate-delay-300">
								<FormLabel className="text-sm font-medium text-muted-foreground">
									Email Address
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="email"
										placeholder="Enter your email address"
										className="rounded-2xl border-border bg-foreground/5 backdrop-blur-sm focus:border-violet-400/70 focus:bg-violet-500/10"
										disabled={isLoading || form.formState.isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="animate-element animate-delay-400">
								<FormLabel className="text-sm font-medium text-muted-foreground">
									Password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											className="rounded-2xl border-border bg-foreground/5 backdrop-blur-sm focus:border-violet-400/70 focus:bg-violet-500/10 pr-12"
											disabled={isLoading || form.formState.isSubmitting}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute inset-y-0 right-0 px-3 py-0 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isLoading || form.formState.isSubmitting}>
											{showPassword ? (
												<EyeOff className="w-4 h-4 text-muted-foreground" />
											) : (
												<Eye className="w-4 h-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="animate-element animate-delay-500 flex items-center justify-between">
						<FormField
							control={form.control}
							name="rememberMe"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-2 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isLoading || form.formState.isSubmitting}
										/>
									</FormControl>
									<FormLabel className="text-sm text-foreground/90 cursor-pointer font-normal">
										Stay logged in
									</FormLabel>
								</FormItem>
							)}
						/>
						<Button
							type="button"
							variant="link"
							className="p-0 h-auto text-violet-400 hover:text-violet-300"
							onClick={handleResetPassword}
							disabled={isLoading || form.formState.isSubmitting}>
							Reset password
						</Button>
					</div>

					<Button
						type="submit"
						disabled={isLoading || form.formState.isSubmitting}
						className="animate-element animate-delay-600 w-full rounded-2xl py-6 font-medium">
						{isLoading || form.formState.isSubmitting
							? "Logging in..."
							: "Log in"}
					</Button>
				</form>
			</Form>

			<div className="animate-element animate-delay-700 relative flex items-center justify-center">
				<span className="w-full border-t border-border"></span>
				<span className="px-4 text-sm text-muted-foreground bg-background absolute">
					Or continue with
				</span>
			</div>

			<Button
				variant="outline"
				onClick={handleGoogleSignIn}
				disabled={isLoading || form.formState.isSubmitting}
				className="animate-element animate-delay-800 w-full rounded-2xl py-6 border-border hover:bg-secondary">
				<GoogleIcon />
				Continue with Google
			</Button>

			<p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
				New to our platform?{" "}
				<Link
					href="/register"
					className="text-violet-400 hover:underline transition-colors">
					Create Account
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;
