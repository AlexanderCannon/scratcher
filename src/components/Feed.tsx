import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import FeedItem from "./FeedItem";
import Button from "./Buttons/Button";

export default function Feed() {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
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
  const [posts, setPosts] = useState(currentPage);

  const handleFetchNextPage = () => {
    if (nextCursor === null) return;
    fetchNextPage()
      .then(() => {
        setPage((prev) => prev + 1);
        setLastPage(lastPage + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (currentPage && posts && page !== lastPage) {
      return setPosts([...posts, ...currentPage]);
    }
    if (currentPage) setPosts(currentPage);
  }, [currentPage]);

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    if (scrollTop + window.innerHeight >= scrollHeight) {
      handleFetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg rounded bg-slate-700 pt-6 shadow">
      <h2 className="mb-2 ml-6 text-xl font-semibold text-white">Your feed</h2>
      {posts ? (
        posts.map((article) => <FeedItem article={article} key={article.id} />)
      ) : (
        <p className="text-gray-600">
          This is where you'll see articles from your favorite contributors.
        </p>
      )}
      {nextCursor && (
        <div className="flex w-full justify-center p-4 align-middle">
          <Button variant="text" onClick={handleFetchNextPage}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
