import type { Diary } from "@/server/db/schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
