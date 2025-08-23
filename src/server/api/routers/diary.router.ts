import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { diaries } from "@/server/db/schema";
import z from "zod";
import { takeFirstOrThrow } from "@/lib/utils";

export const createDiarySchema = z.object({
  patientId: z.string(),
  weekStart: z.string(),
  responses: z.object({
    memory: z.number().int().min(1).max(5),
    orientation: z.number().int().min(1).max(5),
    communication: z.number().int().min(1).max(5),
    dailyActivities: z.number().int().min(1).max(5),
    moodBehavior: z.number().int().min(1).max(5),
    sleep: z.number().int().min(1).max(5),
    social: z.number().int().min(1).max(5),
    notes: z.string().optional(),
  }),
});

export const diaryRouter = createTRPCRouter({
  getDiariesByPatient: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.diaries.findMany({
        where: eq(diaries.patientId, input.patientId),
      });
    }),

  createDiary: protectedProcedure
    .input(createDiarySchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(diaries)
        .values({
          id: crypto.randomUUID(),
          patientId: input.patientId,
          weekStart: input.weekStart,
          responses: input.responses,
        })
        .returning()
        .then(takeFirstOrThrow);

      return result;
    }),
});
