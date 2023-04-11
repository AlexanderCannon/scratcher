import { z } from "zod";
import { UserRole } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "@clerk/nextjs/dist/api";

export const userRouter = createTRPCRouter({
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        slug: input,
        role: {
          in: [UserRole.CONTRIBUTOR, UserRole.EDITOR],
        },
      },
      include: {
        articles: {
          where: {
            published: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
        role: {
          in: [UserRole.CONTRIBUTOR, UserRole.EDITOR],
        },
      },
    });
  }),

  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.userId,
      },
      include: {
        articles: true,
      },
    });
  }),
  getContributors: publicProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.CONTRIBUTOR, UserRole.EDITOR],
        },
      },
    })
  ),
  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        slug: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.user.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          role: {
            in: [UserRole.CONTRIBUTOR, UserRole.EDITOR],
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
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        username: z.string(),
        phone: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = input;
      return ctx.prisma.user.create({
        data,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        username: z.string().optional(),
        phone: z.string().optional(),
        image: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      users.updateUser(ctx.userId, {
        publicMetadata: {
          username: input.username,
          slug: input.slug,
        },
      });
      const data = input;
      return ctx.prisma.user.update({
        where: {
          id: ctx.userId,
        },
        data,
      });
    }),
});
