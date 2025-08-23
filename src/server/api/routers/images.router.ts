import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { images } from "@/server/db/schema";

export const imagesRouter = createTRPCRouter({
  getImages: protectedProcedure
    .input(
      z.object({
        patientId: z.string(), // o .uuid() se il campo è UUID
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.images.findMany({
        where: eq(images.patientId, input.patientId)
      });
    }),
});