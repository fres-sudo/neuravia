import type { Diary } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string | undefined) => {
	if (!date) return "Never";
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function hasCurrentWeekDiary(diaries: Diary[]): boolean {
	const now = new Date();
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay());
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);

	return diaries.some((diary) => {
		const diaryDate = new Date(diary.weekStart);
		return diaryDate >= startOfWeek && diaryDate < endOfWeek;
	});
}

// Helper function to get label color
export function labelClass(label?: string): string {
	switch (label) {
		case "Non_Demented":
			return "bg-emerald-500 text-white";
		case "Very_Mild_Demented":
			return "bg-yellow-500 text-white";
		case "Mild_Demented":
			return "bg-orange-500 text-white";
		case "Moderate_Demented":
			return "bg-red-500 text-white";
		default:
			return "bg-muted text-foreground";
	}
}

export const takeFirst = <T>(values: T[]): T | null => {
	if (values.length === 0) return null;
	return values[0]!;
};

export const takeFirstOrThrow = <T>(values: T[]): T => {
	if (values.length === 0)
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Resource not found",
		});
	return values[0]!;
};

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
