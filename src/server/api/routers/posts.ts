import z from "zod";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, categoryId, cursor } = input;
      const items = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          categories: {
            some: {
              id: categoryId,
            },
          },
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

  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({
      where: {
        slug: input,
      },
    });
  }),
  getByAuthor: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        authorId: input,
      },
    });
  }),
});
