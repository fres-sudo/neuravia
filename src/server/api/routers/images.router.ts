import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { images } from "@/server/db/schema";
import { ImageService } from "@/server/services/imageService";

const imageService = new ImageService();

export const imagesRouter = createTRPCRouter({
  getImages: protectedProcedure
    .input(
      z.object({
        patientId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.images.findMany({
        where: eq(images.patientId, input.patientId),
        orderBy: (images, { desc }) => [desc(images.uploadedAt)],
      });
    }),

  uploadAndProcess: protectedProcedure
  .input(
    z.object({
      patientId: z.string(),
      files: z.array(
        z.object({
          name: z.string(),
          contentBase64: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const results = await imageService.uploadAndProcess(input.patientId, input.files);
    return results;
  }),
});