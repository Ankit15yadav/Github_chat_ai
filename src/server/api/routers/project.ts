// 'use server'
import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure
        .input(z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            // First verify that we have a user ID
            if (!ctx.user.userId) {
                throw new Error("User ID is required");
            }

            console.log("User ID:", ctx.user.userId);

            // Verify the user exists in the database
            const user = await ctx.db.user.findUnique({
                where: { id: ctx.user.userId }
            });

            if (!user) {
                throw new Error("User not found in database");
            }

            // Now create the project with the verified user
            const project = await ctx.db.project.create({
                data: {
                    name: input.name,
                    githubUrl: input.githubUrl,
                    UserToProjects: {
                        create: {
                            userId: ctx.user.userId,
                        },
                    },
                },
            });

            return project;
        }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        const projects = await ctx.db.project.findMany({
            where: {
                UserToProjects: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
        return projects;
    })
})