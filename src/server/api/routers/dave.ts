
import { Account, SavingsAccount } from "@prisma/client";
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const daveRouter = createTRPCRouter({
    getAllSavingsAccount: protectedProcedure.query(async ({ ctx }) => {
        const accounts = await ctx.prisma.savingsAccount.findMany({
            where: {
                userId: ctx.session.user.id,
            }
        });
        return accounts;
    }),
    createSavingsAccount: protectedProcedure
        .input(
            z.object({
                name: z.string().min(3).max(40),
                location: z.string().min(3).max(40)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            if (userId === undefined) {
                return
            }
            const savingAccount = await ctx.prisma.savingsAccount.create({
                data: {
                    userId,
                    name: input.name,
                    location: input.location,
                },
            });
            return savingAccount;
        })
})