import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const starsRouter = createTRPCRouter({
  getMyStarers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.star.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getMyStars: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.star.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  star: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
      if (!user) throw new Error("User not found");
      return ctx.prisma.star.create({
        data: {
          articleId: input,
          userId: ctx.session.user.id,
        },
      });
    }),
  unstar: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
      if (!user) throw new Error("User not found");
      return ctx.prisma.star.delete({
        where: {
          articleId_userId: {
            articleId: input,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        articleId: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, articleId, userId, cursor } = input;
      const items = await ctx.prisma.star.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          userId,
          articleId,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
