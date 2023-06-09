import { api } from "~/utils/api";
import Link from "~/components/Link";
import Layout from "~/components/Layout";
import { List, ListItem } from "~/components/List";
import Image from "next/image";
import Loading from "~/components/Loading";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PaginationButtons from "~/components/PaginationButtons";
import Typography from "~/components/Typography";
import ContributorProfile from "~/components/ContributorProfile";

const Contributors = () => {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page ?? 0));
  const { data, fetchNextPage, isLoading, isFetchingNextPage } =
    api.user.getBatch.useInfiniteQuery(
      {
        limit: 9,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (page === 0) {
      void router.push("/contributors", undefined, { shallow: true });
    } else {
      void router.push(`/contributors?page=${page}`, undefined, {
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
  return (
    <Layout>
      <Typography as="h1" variant="heading">
        Our brilliant authors
      </Typography>
      {isLoading || isFetchingNextPage || !currentPage ? (
        <Loading />
      ) : (
        <>
          <List direction="row">
            {currentPage?.map((user) => {
              return (
                // <Link href={`/contributors/${user.slug ?? ""}`} key={user.id}>
                <ContributorProfile user={user} />
                // </Link>
              );
            })}
          </List>
          <PaginationButtons
            page={page}
            nextCursor={nextCursor}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </>
      )}
    </Layout>
  );
};

export default Contributors;
