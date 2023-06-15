
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import type { Transaction } from "@prisma/client";

export const SavingsAccountType = z.union([
    z.literal('BOUND'),
    z.literal('UNBOUND'),
    z.literal('BONDS'),
    z.literal('CASH')
])

const sumTransactions = function(items: Transaction[]) {
    return items.reduce( function(a: number, b: Transaction) {
      return a + b.amount;
    }, 0);
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
                type: z.string()
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
                    type: SavingsAccountType.parse(input.type)
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
                comment: z.string().max(30),
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
                    comment: input.comment,
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
            return sumTransactions(transactions);
        }),
    getTotalsSavingsSum: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;
            if (userId === undefined) {
                return
            }
            const accounts = await ctx.prisma.savingsAccount.findMany({
                where: {
                    user: {
                        id: userId
                    }
                }
            }
            )
            let totalSum = 0;
            for(let i = 0; i < accounts.length; i++){
                const transactions = await ctx.prisma.transaction.findMany({
                    where: {
                        accountId: accounts[i]?.id
                        }
                })
                totalSum += sumTransactions(transactions)
            }
            return totalSum
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
                },
                orderBy: {
                    datetime: "desc"
                }
            })
            return transactions
        })
})