import z from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subscriberRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.subscriber.create({
        data: {
          email: input,
        },
      });
    }),
  unsubscribe: publicProcedure
    .input(z.string().email())
    .mutation(async ({ ctx, input }) => {
      ctx.prisma.subscriber.delete({
        where: {
          email: input,
        },
      });
      return {
        success: true,
      };
    }),
});
