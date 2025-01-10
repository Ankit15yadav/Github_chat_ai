import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {

        console.log(input);

        if (!ctx.user?.userId) {
            throw new Error("User not authenticated");
        }

        const project = await ctx.db.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                UserToProject: {
                    create: {
                        userId: ctx.user.userId!,  // Ensure userId is correctly referenced
                    },
                },
            },
        });
        return project;
    }),

})