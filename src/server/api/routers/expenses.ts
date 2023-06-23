import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const expensesRouter = createTRPCRouter({
    createExpense: protectedProcedure
        .input(
            z.object({
                amount: z.number().min(1),
                title: z.string().min(3),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const expense = await ctx.prisma.expense.create({
                data: {
                    amount: input.amount,
                    userId: ctx.session.user.id,
                    title: input.title
                }
            })
            return expense
        }),
    getAllExpenses: protectedProcedure
        .query(async ({ ctx }) => {
            const expenses = await ctx.prisma.expense.findMany({
                where: {
                    userId: ctx.session.user.id
                }
            });
            return expenses;
        })
})