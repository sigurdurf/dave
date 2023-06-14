
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { Transaction } from "@prisma/client";

const SavingsAccountType = z.union([
    z.literal('BOUND'),
    z.literal('UNBOUND'),
    z.literal('BONDS'),
    z.literal('CASH')
])
const sum = function(items, prop: string): number {
    return items.reduce( function(a: number, b: number) : number {
      return a + b[prop]
    }, 0)
  }
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
                location: z.string().min(3).max(40),
                type: SavingsAccountType
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
                    type: input.type
                },
            });
            const transaction = await ctx.prisma.transaction.create({
                data: {
                    amount: 0,
                    accountId: savingAccount.id,
                }
            })
            return [savingAccount, transaction];
        }),
    createTransaction: protectedProcedure
        .input(
            z.object({
                amount: z.number(),
                accountId: z.string(),
            })
        )
        .mutation( async ({ctx, input}) => {
            const userId = ctx.session.user.id;
            if (userId === undefined) {
                return
            }
            const savingAccount = await ctx.prisma.savingsAccount.findFirst({
                where: {
                    id: input.accountId
                }
            })
            if (savingAccount === null) {
                return
            }
            const transaction = await ctx.prisma.transaction.create({
                data: {
                    amount: input.amount,
                    accountId: savingAccount.id

                }
            })
            return transaction
        }),
    getSavingsAccountSum: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input}) => {
            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    account: {
                        id: input
                    }
                }
            })
            return sum(transactions, 'amount');
        }),
    getAccountTransactions: protectedProcedure
        .input(
            z.string()
        )
        .query(async ({ctx, input}) => {
            const transactions = await ctx.prisma.transaction.findMany({
                where: {
                    account: {
                        user: {
                            id: ctx.session.user.id
                        },
                        id: input
                    }
                }
            })
            return transactions
        })
})