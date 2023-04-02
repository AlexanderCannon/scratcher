import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";

export default function PostPage() {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page ?? 0));
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    api.posts.getBatch.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (page === 0) {
      void router.push("/post", undefined, { shallow: true });
    } else {
      void router.push(`/post?page=${page}`, undefined, { shallow: true });
    }
  }, [page]);

  const handleFetchNextPage = () => {
    console.log("fetching next page");
    fetchNextPage()
      .then(() => {
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFetchPreviousPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  const currentPage = data?.pages[page]?.items;
  const nextCursor = data?.pages[page]?.nextCursor;
  if (!currentPage) return <p>not found</p>;
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {isLoading || isFetchingNextPage ? (
          <p>Loading...</p>
        ) : (
          currentPage.map((post) => (
            <li key={post.id}>
              <Link href={`/post/${post.slug}`}>
                <h1>{post.title}</h1>
              </Link>
            </li>
          ))
        )}
      </ul>
      <button disabled={page === 0} onClick={handleFetchPreviousPage}>
        Previous
      </button>
      <button disabled={!nextCursor} onClick={handleFetchNextPage}>
        Next
      </button>
    </div>
  );
}
