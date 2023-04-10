import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { articlesRouter } from "./routers/articles";
import { categoriesRouter } from "./routers/categories";
import { starsRouter } from "./routers/stars";
import { followsRouter } from "./routers/follows";
import { commentsRouter } from "./routers/comments";

/**
 * Root router for the API
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  articles: articlesRouter,
  categories: categoriesRouter,
  comments: commentsRouter,
  follows: followsRouter,
  stars: starsRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
