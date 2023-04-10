import { useState } from "react";
import { api } from "~/utils/api";
import FeedItem from "./FeedItem";

export default function Feed() {
  const [page, setPage] = useState(0);
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    api.articles.getArticlesByFollowing.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const currentPage = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;
  if (!currentPage?.length) {
    return (
      <>
        <h2 className="mb-2 text-xl font-semibold text-gray-800">Your feed</h2>
        <p className="text-gray-600">
          This is where you'll see articles from your favorite contributors.
        </p>
      </>
    );
  }
  return (
    <>
      <h2 className="mb-2 text-xl font-semibold text-gray-800">Your feed</h2>
      {currentPage.map((article) => (
        <FeedItem article={article} key={article.id} />
      ))}
    </>
  );
}