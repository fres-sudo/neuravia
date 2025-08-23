import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { patients } from "@/server/db/schema";
import { takeFirstOrThrow } from "@/lib/utils";
import { createPatientSchema } from "@/server/db/zod";

export const patientsRouter = createTRPCRouter({
	fetch: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.patients.findMany({
			where: eq(patients.caregiverId, ctx.session.user.id),
			with: {
				diaries: true,
				settings: true,
			},
		});
	}),
	create: protectedProcedure
		.input(createPatientSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.insert(patients)
				.values({
					id: crypto.randomUUID(),
					name: input.name,
					caregiverId: ctx.session.user.id,
					age: input.age,
					initialInfo: input.initialInfo,
				})
				.returning()
				.then(takeFirstOrThrow);
		}),
});
