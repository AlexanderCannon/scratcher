import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, articleId, cursor } = input;
      const items = await ctx.prisma.comment.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          articleId,
        },
        include: {
          author: true,
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
  getComment: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.comment.findFirst({
      where: {
        id: input,
      },
    });
  }),
  createComment: protectedProcedure
    .input(
      z.object({
        articleId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findFirst({
        where: {
          id: input.articleId,
        },
      });
      if (!article) throw new Error("Article not found");
      return ctx.prisma.comment.create({
        data: {
          articleId: input.articleId,
          authorId: ctx.session.user.id,
          content: input.content,
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input,
        },
      });
      if (comment?.authorId! == ctx.session.user.id) {
        throw new Error("You are not the author of this comment");
      }
      if (!comment) throw new Error("Comment not found");
      return ctx.prisma.comment.delete({
        where: {
          id: input,
        },
      });
    }),
  updateComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!comment) throw new Error("Comment not found");
      if (comment?.authorId! == ctx.session.user.id) {
        throw new Error("You are not the author of this comment");
      }
      return ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
});
