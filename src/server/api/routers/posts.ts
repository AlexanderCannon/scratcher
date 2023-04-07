import z from "zod";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedContributorProcedure,
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
          createdAt: "desc",
        },
        where: {
          published: true,
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
      include: {
        categories: true,
        author: true,
      },
    });
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({
      where: {
        published: true,
        slug: input,
      },
      include: {
        categories: true,
        author: true,
      },
    });
  }),

  getBySlugContributor: protectedContributorProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({
        where: {
          authorId: ctx.session.user.id,
          slug: input,
        },
        include: {
          categories: true,
          author: true,
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
  getByCategory: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        categories: {
          some: {
            id: input,
          },
        },
      },
    });
  }),
  create: protectedContributorProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        authorId: z.string(),
        categories: z.array(z.string()),
        image: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          slug: input.title
            .toLocaleLowerCase()
            .replaceAll(" ", "-")
            .replaceAll(/[\;\,\/\?\:\@\&\=\+\$\_\.!\~\*\'\(\)\#]/g, ""),
          content: input.content,
          authorId: input.authorId,
          createdAt: new Date(),
          published: input.published,
          categories: {
            connect: input.categories.map((id) => ({ id })),
          },
        },
      });
    }),
  update: protectedContributorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        authorId: z.string(),
        categories: z.array(z.string()),
        image: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (
        ctx.session.user.role !== "ADMIN" &&
        ctx.session.user.role !== "EDITOR" &&
        ctx.session.user.id !== input.authorId
      ) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          slug: input.title
            .toLocaleLowerCase()
            .replaceAll(" ", "-")
            .replaceAll(/[\;\,\/\?\:\@\&\=\+\$\_\.!\~\*\'\(\)\#]/g, ""),
          content: input.content,
          authorId: input.authorId,
          published: input.published,
          image: input.image,
          updatedAt: new Date(),
          categories: {
            connect: input.categories.map((id) => ({ id })),
          },
        },
      });
    }),
  partialUpdate: protectedContributorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        authorId: z.string().optional(),
        categories: z.array(z.string()).optional(),
        image: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (
        ctx.session.user.role !== "ADMIN" &&
        ctx.session.user.role !== "EDITOR" &&
        ctx.session.user.id !== input.authorId
      ) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          slug:
            input.title &&
            input.title
              .toLocaleLowerCase()
              .replaceAll(" ", "-")
              .replaceAll(/[\;\,\/\?\:\@\&\=\+\$\_\.!\~\*\'\(\)\#]/g, ""),
          content: input.content,
          authorId: input.authorId,
          image: input.image,
          categories: {
            connect: input.categories?.map((id) => ({ id })),
          },
        },
      });
    }),
  delete: protectedContributorProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
});
