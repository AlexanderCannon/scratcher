import { z } from "zod";
import { UserRole } from "@prisma/client";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
        posts: {
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
        id: ctx.session.user.id,
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
      const data = input;
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data,
      });
    }),
  adminUpdate: protectedAdminProcedure
    .input(
      z.object({
        name: z.string(),
        phoneNumber: z.string(),
        role: z.enum([UserRole.ADMIN, UserRole.EDITOR, UserRole.CONTRIBUTOR]),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = input;
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data,
      });
    }),
});
