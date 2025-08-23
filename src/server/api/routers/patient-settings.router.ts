import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { patientSettings } from "@/server/db/schema";

export const patientSettingsRouter = createTRPCRouter({
  getSettings: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const setting = await ctx.db
        .query.patientSettings.findFirst({
          where: eq(patientSettings.patientId, input.patientId),
        });

      return setting ?? null; // Return null if not found instead of throwing error
    }),

  createSettings: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        settings: z.object({
          language: z.string(),
          activityDifficultySensitivity: z.number(),
          activityRandomness: z.number(),
          maxDailyActivities: z.number(),
          reminderTime: z.string(),
          showHints: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(patientSettings)
        .values({
          patientId: input.patientId,
          settings: input.settings,
        })
        .returning()
        .then((results) => results[0]);

      return result;
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
        settings: z.object({
          language: z.string(),
          activityDifficultySensitivity: z.number(),
          activityRandomness: z.number(),
          maxDailyActivities: z.number(),
          reminderTime: z.string(),
          showHints: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(patientSettings)
        .set({ settings: input.settings })
        .where(eq(patientSettings.patientId, input.patientId))
        .returning()
        .then((results) => results[0]);

      return updated;
    }),
});
