import { createTRPCRouter, publicProcedure } from "../trpc";

export const careGiverRouter = createTRPCRouter({
	get: publicProcedure.query(() => {
		return { success: true };
	}),
});
