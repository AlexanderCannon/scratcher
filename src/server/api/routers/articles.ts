import z from "zod";
import {
  createTRPCRouter,
  protectedContributorProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";

const filterUserForPublic = (user: User) => {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    username: user.username,
    image: user.profileImageUrl,
  };
};

export const articlesRouter = createTRPCRouter({
  getRecent: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.article.findMany({
      take: 5,
      where: {
        authorId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
      const items = await ctx.prisma.article.findMany({
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
        include: {
          categories: true,
        },
      });
      const users = await clerkClient.users.getUserList({
        userId: items.map((item) => item.authorId),
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: items.map((item) => {
          const author = users.find((user) => user.id === item.authorId);
          if (!author) {
            throw new Error("Author not found");
          }
          return {
            ...item,
            author: filterUserForPublic(author),
          };
        }),
        nextCursor,
      };
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const article = await ctx.prisma.article.findFirst({
      where: {
        id: input,
      },
      include: {
        categories: true,
      },
    });
    if (!article) throw new Error("Article not found");
    const user = await clerkClient.users.getUser(article.authorId);
    return { ...article, author: filterUserForPublic(user) };
  }),
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const article = await ctx.prisma.article.findFirst({
      where: {
        published: true,
        slug: input,
      },
      include: {
        categories: true,
      },
    });
    if (!article) throw new Error("Article not found");
    const user = await clerkClient.users.getUser(article.authorId);
    return { ...article, author: filterUserForPublic(user) };
  }),

  getBySlugContributor: protectedContributorProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const article = await ctx.prisma.article.findFirst({
        where: {
          authorId: ctx.user.id,
          slug: input,
        },
        include: {
          categories: true,
        },
      });
      if (!article) throw new Error("Article not found");
      const user = await clerkClient.users.getUser(article.authorId);
      return { article, author: filterUserForPublic(user) };
    }),
  getByAuthor: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.article.findMany({
      where: {
        authorId: input,
      },
    });
  }),

  getByCategory: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        categoryId: z.string().optional(),
        categorySlug: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        limit,
        skip,
        cursor,
        categoryId: category,
        categorySlug: slug,
      } = input;
      const items = await ctx.prisma.article.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          categories: {
            some: {
              id: category,
              slug: slug,
            },
          },
          published: true,
        },
      });

      const users = await clerkClient.users.getUserList({
        userId: items.map((item) => item.authorId),
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: items.map((item) => {
          const author = users.find((user) => user.id === item.authorId);
          if (!author) {
            throw new Error("Author not found");
          }
          return {
            ...item,
            author: filterUserForPublic(author),
          };
        }),
        nextCursor,
      };
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
      return ctx.prisma.article.create({
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
          intro: input.content.substring(0, 190),
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
        ctx.user.privateMetadata.role !== "ADMIN" &&
        ctx.user.privateMetadata.role !== "EDITOR" &&
        ctx.user.id !== input.authorId
      ) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.article.update({
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
          intro: input.content.substring(0, 190),
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
        ctx.user.privateMetadata.role !== "ADMIN" &&
        ctx.user.privateMetadata.role !== "EDITOR" &&
        ctx.userId !== input.authorId
      ) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.article.update({
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
          intro: input.content?.substring(0, 190),
          categories: {
            connect: input.categories?.map((id) => ({ id })),
          },
        },
      });
    }),
  delete: protectedContributorProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.article.delete({
        where: {
          id: input,
        },
      });
    }),
  getArticlesByFollowing: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const following = await ctx.prisma.follow.findMany({
        where: {
          followerId: ctx.userId,
        },
        select: {
          followingId: true,
        },
      });
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.article.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          authorId: {
            in: following.map(({ followingId }) => followingId),
          },
          published: true,
        },
        include: {
          categories: true,
        },
      });
      const users = await clerkClient.users.getUserList({
        userId: items.map((item) => item.authorId),
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return {
        items: items.map((item) => {
          const author = users.find((user) => user.id === item.authorId);
          if (!author) {
            throw new Error("Author not found");
          }
          return {
            ...item,
            author: filterUserForPublic(author),
          };
        }),
        nextCursor,
      };
    }),
});
