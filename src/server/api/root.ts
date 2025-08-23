import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { careGiverRouter } from "./routers/care-giver.router";
import { imagesRouter } from "./routers/images.router";
import { patientsRouter } from "./routers/patients.router";
import { diaryRouter } from "./routers/diary.router";
import { patientSettingsRouter } from "./routers/patient-settings.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	careGiver: careGiverRouter,
	patients: patientsRouter,
	images: imagesRouter,
	diary: diaryRouter,
	patientSettings: patientSettingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
