import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.account.findFirst({
      where: {
        userId: input,
      },
    });
  }),
});
