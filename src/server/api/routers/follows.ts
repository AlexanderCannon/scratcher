import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const followsRouter = createTRPCRouter({
  getMyFollowers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.follow.findMany({
      where: {
        followingId: ctx.session.user.id,
      },
      include: {
        follower: true,
      },
    });
  }),
  getMyFollowing: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.follow.findMany({
      where: {
        followerId: ctx.session.user.id,
      },
      include: {
        following: true,
      },
    });
  }),
  follow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
      if (!user) throw new Error("User not found");
      const follow = ctx.prisma.follow.create({
        data: {
          followingId: input,
          followerId: ctx.session.user.id,
        },
      });
      return follow;
    }),
  unfollow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
      if (!user) throw new Error("User not found");
      const unfollow = ctx.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followingId: input,
            followerId: ctx.session.user.id,
          },
        },
      });
      ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          followingCount: {
            increment: 1,
          },
        },
      });
      ctx.prisma.user.update({
        where: {
          id: input,
        },
        data: {
          followerCount: {
            increment: 1,
          },
        },
      });
      return unfollow;
    }),

  isFollowing: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
      if (!user) throw new Error("User not found");
      const follow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followingId: input,
            followerId: ctx.session.user.id,
          },
        },
      });
      return follow ? true : false;
    }),

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        followingId: z.string().optional(),
        followerId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, followingId, followerId, cursor } = input;
      const items = await ctx.prisma.follow.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          followingId,
          followerId,
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
