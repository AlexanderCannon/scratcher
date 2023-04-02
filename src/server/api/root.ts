import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { postsRouter } from "./routers/posts";
import { categoriesRouter } from "./routers/categories";

/**
 * Root router for the API
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
