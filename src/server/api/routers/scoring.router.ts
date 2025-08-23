import { eq, desc, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { boostScores, patients } from "@/server/db/schema";
import { takeFirstOrThrow } from "@/lib/utils";
import { z } from "zod";
import { BoostScoreService } from "@/scoring/service";

// Schema for inserting a boost score
const insertBoostScoreSchema = z.object({
  patientId: z.string(),
  activityType: z.enum(['initial_assessment', 'mri_upload', 'weekly_form', 'game_played']),
  previousScore: z.number().optional(),
  newScore: z.number(),
  activityValue: z.number(),
  weight: z.number().min(0.1).max(1.0),
  metadata: z.any().optional(),
});

// Schema for fetching boost scores
const fetchBoostScoresSchema = z.object({
  patientId: z.string(),
  limit: z.number().optional().default(10),
});

export const scoringRouter = createTRPCRouter({
  // Insert a new boost score
  insert: protectedProcedure
    .input(insertBoostScoreSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify that the patient belongs to the caregiver
      const patient = await ctx.db
        .query.patients.findFirst({
          where: eq(patients.id, input.patientId),
        });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.caregiverId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      console.log('Seems to be okay so far');

      return await ctx.db
        .insert(boostScores)
        .values({
          id: crypto.randomUUID(),
          patientId: input.patientId,
          activityType: input.activityType,
          previousScore: input.previousScore,
          newScore: input.newScore,
          activityValue: input.activityValue,
          weight: input.weight,
          metadata: input.metadata,
        })
        .returning()
        .then(takeFirstOrThrow);
    }),

  // Fetch boost scores for a patient
  fetchByPatient: protectedProcedure
    .input(fetchBoostScoresSchema)
    .query(async ({ ctx, input }) => {
      // Verify that the patient belongs to the caregiver
      const patient = await ctx.db
        .query.patients.findFirst({
          where: eq(patients.id, input.patientId),
        });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.caregiverId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      return await ctx.db
        .select()
        .from(boostScores)
        .where(eq(boostScores.patientId, input.patientId))
        .orderBy(desc(boostScores.timestamp))
        .limit(input.limit);
    }),

  // Get the latest score for a patient
  getLatestScore: protectedProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify that the patient belongs to the caregiver
      const patient = await ctx.db
        .query.patients.findFirst({
          where: eq(patients.id, input.patientId),
        });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.caregiverId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      return await ctx.db
        .select()
        .from(boostScores)
        .where(eq(boostScores.patientId, input.patientId))
        .orderBy(desc(boostScores.timestamp))
        .limit(1)
        .then((results) => results[0] || null);
    }),

  // Get score history for a patient
  getScoreHistory: protectedProcedure
    .input(z.object({ 
      patientId: z.string(),
      activityType: z.enum(['initial_assessment', 'mri_upload', 'weekly_form', 'game_played']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify that the patient belongs to the caregiver
      const patient = await ctx.db
        .query.patients.findFirst({
          where: eq(patients.id, input.patientId),
        });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.caregiverId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      const whereConditions = input.activityType 
        ? and(eq(boostScores.patientId, input.patientId), eq(boostScores.activityType, input.activityType))
        : eq(boostScores.patientId, input.patientId);

      return await ctx.db
        .select()
        .from(boostScores)
        .where(whereConditions)
        .orderBy(desc(boostScores.timestamp));
    }),

  // Insert score with automatic previous score calculation
  insertWithPreviousScore: protectedProcedure
    .input(z.object({
      patientId: z.string(),
      activityType: z.enum(['initial_assessment', 'mri_upload', 'weekly_form', 'game_played']),
      activityValue: z.number(),
      weight: z.number().min(0.1).max(1.0).optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify that the patient belongs to the caregiver
      const patient = await ctx.db
        .query.patients.findFirst({
          where: eq(patients.id, input.patientId),
        });

      if (!patient) {
        throw new Error("Patient not found");
      }

      if (patient.caregiverId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      // Get the latest score
      const latestScore = await ctx.db
        .select()
        .from(boostScores)
        .where(eq(boostScores.patientId, input.patientId))
        .orderBy(desc(boostScores.timestamp))
        .limit(1)
        .then((results) => results[0]?.newScore ?? 0);

      const boostService = new BoostScoreService();
      const weight = input.weight ?? boostService.getDefaultWeight(input.activityType);
      const newScore = boostService.calculateNewScore(latestScore, input.activityValue, weight);

      return await ctx.db
        .insert(boostScores)
        .values({
          id: crypto.randomUUID(),
          patientId: input.patientId,
          activityType: input.activityType,
          previousScore: latestScore,
          newScore: newScore,
          activityValue: input.activityValue,
          weight: weight,
          metadata: input.metadata,
        })
        .returning()
        .then(takeFirstOrThrow);
    }),
});
