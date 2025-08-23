import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { diaries, boostScores } from "@/server/db/schema";
import z from "zod";
import { takeFirstOrThrow } from "@/lib/utils";
import { BoostScoreService } from "@/scoring/service";

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
      const boostService = new BoostScoreService();

      // Create the diary entry
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

      // Calculate and insert the score
      const responses = [
        input.responses.memory,
        input.responses.orientation,
        input.responses.communication,
        input.responses.dailyActivities,
        input.responses.moodBehavior,
        input.responses.sleep,
        input.responses.social,
      ];

      const activityValue = await boostService.calculateWeeklyForm(responses);
      
      // Get the latest score to calculate the new score
      const latestScore = await ctx.db
        .select()
        .from(boostScores)
        .where(eq(boostScores.patientId, input.patientId))
        .orderBy(desc(boostScores.timestamp))
        .limit(1)
        .then((results) => results[0]?.newScore ?? 0);

      const scoreData = boostService.prepareScoreData({
        patientId: input.patientId,
        activityType: 'weekly_form',
        activityValue: activityValue,
        previousScore: latestScore,
        metadata: {
          diaryId: result.id,
          weekStart: input.weekStart,
          responses: input.responses,
        },
      });

      // Insert the score
      await ctx.db
        .insert(boostScores)
        .values({
          id: crypto.randomUUID(),
          ...scoreData,
        });

      return result;
    }),
});
