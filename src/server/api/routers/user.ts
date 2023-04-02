import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getByIdPrivate: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getAuthors: publicProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany({
      where: {
        Post: {
          some: {
            published: true,
          },
        },
      },
    })
  ),
});
