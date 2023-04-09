import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { articlesRouter } from "./routers/articles";
import { categoriesRouter } from "./routers/categories";
import { starsRouter } from "./routers/stars";
import { followsRouter } from "./routers/follows";

/**
 * Root router for the API
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  articles: articlesRouter,
  categories: categoriesRouter,
  follows: followsRouter,
  stars: starsRouter,
});

export type AppRouter = typeof appRouter;
