"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/server/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleIcon } from "../layout";

// Zod schema with English error messages
const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "Full name is required")
			.min(2, "Name must contain at least 2 characters")
			.max(50, "Name cannot exceed 50 characters")
			.regex(
				/^[a-zA-ZÀ-ÿ\s'.-]+$/,
				"Name can only contain letters, spaces and apostrophes",
			),
		email: z.email("Enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must contain at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one lowercase letter, one uppercase letter, and one number",
			),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
		agreeToTerms: z
			.boolean()
			.refine(
				(val) => val === true,
				"You must accept the terms of service and privacy policy",
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			agreeToTerms: false,
		},
	});

	const onSubmit = async (data: RegisterFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const result = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				callbackURL: "/dashboard",
			});

			if (result.error) {
				setError(
					result.error.message || "An error occurred during registration",
				);
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Registration error:", err);
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
				setError(result.error.message || "Google sign-in failed");
			}
		} catch (error) {
			console.error("Google sign in error:", error);
			setError("An error occurred during Google sign-in");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="animate-delay-100 animate-element">
				<h1 className="font-semibold text-4xl leading-tight md:text-5xl">
					<span className="font-light text-foreground tracking-tighter">
						Join Us
					</span>
				</h1>
				<p className="mt-2 text-muted-foreground">
					Create your account and start your journey with us
				</p>
			</div>

			<Form {...form}>
				<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
					{error && (
						<Alert
							variant="destructive"
							className="animate-delay-300 animate-element"
						>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="animate-delay-300 animate-element">
								<FormLabel className="font-medium text-muted-foreground text-sm">
									Full Name
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Enter your full name"
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
						name="email"
						render={({ field }) => (
							<FormItem className="animate-delay-400 animate-element">
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
							<FormItem className="animate-delay-500 animate-element">
								<FormLabel className="font-medium text-muted-foreground text-sm">
									Password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPassword ? "text" : "password"}
											placeholder="Create a secure password"
											className="rounded-2xl border-border bg-foreground/5 pr-12 backdrop-blur-sm focus:border-violet-400/70 focus:bg-violet-500/10"
											disabled={isLoading || form.formState.isSubmitting}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute inset-y-0 right-0 px-3 py-0 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
											disabled={isLoading || form.formState.isSubmitting}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormDescription className="text-muted-foreground text-xs">
									Must contain at least 8 characters, one lowercase letter, one
									uppercase letter, and one number
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="animate-delay-600 animate-element">
								<FormLabel className="font-medium text-muted-foreground text-sm">
									Confirm Password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm your password"
											className="rounded-2xl border-border bg-foreground/5 pr-12 backdrop-blur-sm focus:border-violet-400/70 focus:bg-violet-500/10"
											disabled={isLoading || form.formState.isSubmitting}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute inset-y-0 right-0 px-3 py-0 hover:bg-transparent"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											disabled={isLoading || form.formState.isSubmitting}
										>
											{showConfirmPassword ? (
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

					<FormField
						control={form.control}
						name="agreeToTerms"
						render={({ field }) => (
							<FormItem className="flex animate-delay-700 animate-element flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isLoading || form.formState.isSubmitting}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel className="cursor-pointer font-normal text-foreground/90 text-sm leading-relaxed">
										I accept the{" "}
										<Link
											href="#"
											className="text-violet-400 transition-colors hover:underline"
										>
											Terms of Service
										</Link>{" "}
										and the{" "}
										<Link
											href="#"
											className="text-violet-400 transition-colors hover:underline"
										>
											Privacy Policy
										</Link>
									</FormLabel>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={isLoading || form.formState.isSubmitting}
						className="w-full animate-delay-800 animate-element rounded-2xl py-6 font-medium"
					>
						{isLoading || form.formState.isSubmitting
							? "Creating account..."
							: "Create Account"}
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
				className="w-full animate-delay-800 animate-element rounded-2xl border-border py-6 hover:bg-secondary"
			>
				<GoogleIcon />
				Continue with Google
			</Button>

			<p className="animate-delay-900 animate-element text-center text-muted-foreground text-sm">
				Already have an account?{" "}
				<Link
					href="/login"
					className="text-violet-400 transition-colors hover:underline"
				>
					Log in
				</Link>
			</p>
		</div>
	);
};

export default RegisterPage;
