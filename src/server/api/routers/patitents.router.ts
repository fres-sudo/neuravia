import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { patients } from "@/server/db/schema";

export const patientsRouter = createTRPCRouter({
	getPatients: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.patients.findMany({
			where: eq(patients.caregiverId, ctx.session.user.id),
			with: {
				diaries: true,
				settings: true,
			},
		});
	}),
});
