import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "~/components/Link";
import { api } from "~/utils/api";
import Layout from "~/components/Layout";
import Loading from "~/components/Loading";
import { List, ListItem } from "~/components/List";
import PaginationButtons from "~/components/PaginationButtons";
import NotFound from "~/components/NotFound";
import Typography from "~/components/Typography";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page ?? 0));
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    api.categories.getBatch.useInfiniteQuery(
      {
        limit: 9,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (page === 0) {
      void router.push("/categories", undefined, { shallow: true });
    } else {
      void router.push(`/categories?page=${page}`, undefined, {
        shallow: true,
      });
    }
  }, [page]);

  const handleFetchNextPage = () => {
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
  if (!currentPage)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout>
      <Typography as="h1" variant="heading">
        Categories
      </Typography>
      <List direction="row">
        {isLoading || isFetchingNextPage ? (
          <Loading />
        ) : (
          currentPage.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              className="m-6"
              key={category.id}
            >
              <ListItem>
                <Typography
                  as="h2"
                  variant="subheading"
                  className="ml-0 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                >
                  {category.name}
                </Typography>
              </ListItem>
            </Link>
          ))
        )}
      </List>
      <PaginationButtons
        page={page}
        nextCursor={nextCursor}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </Layout>
  );
}
