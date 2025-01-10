import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(z.object({})).mutation(async ({ ctx, input }) => {
        ctx.user.userId
    })
})