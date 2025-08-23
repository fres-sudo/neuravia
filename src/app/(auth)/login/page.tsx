"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleIcon } from "../layout";
import { signIn } from "@/server/auth/auth-client";

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
			const result = await signIn.email({
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
			const result = await signIn.social({
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
			<div className="animate-delay-100 animate-element">
				<h1 className="font-semibold text-4xl leading-tight md:text-5xl">
					<span className="font-light text-foreground tracking-tighter">
						Welcome back
					</span>
				</h1>
				<p className="mt-2 text-muted-foreground">
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
							className="animate-delay-300 animate-element">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="animate-delay-300 animate-element">
								<FormLabel className="font-medium text-muted-foreground text-sm">
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
							<FormItem className="animate-delay-400 animate-element">
								<FormLabel className="font-medium text-muted-foreground text-sm">
									Password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPassword ? "text" : "password"}
											placeholder="Enter your password"
											className="rounded-2xl border-border bg-foreground/5 pr-12 backdrop-blur-sm focus:border-violet-400/70 focus:bg-violet-500/10"
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
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex animate-delay-500 animate-element items-center justify-between">
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
									<FormLabel className="cursor-pointer font-normal text-foreground/90 text-sm">
										Stay logged in
									</FormLabel>
								</FormItem>
							)}
						/>
						<Button
							type="button"
							variant="link"
							className="h-auto p-0 text-violet-400 hover:text-violet-300"
							onClick={handleResetPassword}
							disabled={isLoading || form.formState.isSubmitting}>
							Reset password
						</Button>
					</div>

					<Button
						type="submit"
						disabled={isLoading || form.formState.isSubmitting}
						className="w-full animate-delay-600 animate-element rounded-2xl py-6 font-medium">
						{isLoading || form.formState.isSubmitting
							? "Logging in..."
							: "Log in"}
					</Button>
				</form>
			</Form>

			<div className="relative flex animate-delay-700 animate-element items-center justify-center">
				<span className="w-full border-border border-t" />
				<span className="absolute bg-background px-4 text-muted-foreground text-sm">
					Or continue with
				</span>
			</div>

			<Button
				variant="outline"
				onClick={handleGoogleSignIn}
				disabled={isLoading || form.formState.isSubmitting}
				className="w-full animate-delay-800 animate-element rounded-2xl border-border py-6 hover:bg-secondary">
				<GoogleIcon />
				Continue with Google
			</Button>

			<p className="animate-delay-900 animate-element text-center text-muted-foreground text-sm">
				New to our platform?{" "}
				<Link
					href="/register"
					className="text-violet-400 transition-colors hover:underline">
					Create Account
				</Link>
			</p>
		</div>
	);
};

export default LoginPage;
