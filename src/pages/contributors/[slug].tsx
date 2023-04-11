import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "~/components/Link";
import Layout from "~/components/Layout";
import NotFound from "~/components/NotFound";
import Loading from "~/components/Loading";
import { Article } from "@prisma/client";
import { List, ListItem } from "~/components/List";
import Typography from "~/components/Typography";
import { useEffect, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import Button from "~/components/Button";
import ArticleList from "~/components/ArticleList";
import { useUser } from "@clerk/nextjs";

const ContributorPage = () => {
  const { query } = useRouter();

  const { user } = useUser();

  const [slug, setSlug] = useState<string>(query?.slug?.toString() ?? "");
  const { data, isLoading } = api.user.getBySlug.useQuery(slug);
  const isMyPage = user?.id === data?.id;

  const { data: followingData } = api.follows.isFollowing.useQuery(
    data?.id ?? ""
  );
  const follow = api.follows.follow.useMutation();
  const unfollow = api.follows.unfollow.useMutation();

  const [isFollowing, setIsFollowing] = useState<boolean>(
    followingData ?? false
  );
  useEffect(() => {
    setSlug(query?.slug?.toString() ?? "");
  }, [query]);

  useEffect(() => {
    setIsFollowing(followingData ?? false);
  }, [followingData]);

  if (!data) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const { articles } = data;

  if (!query.slug) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }

  const handleFollow = () => {
    if (isFollowing) {
      unfollow.mutate(data.id);
      setIsFollowing(false);
    } else {
      follow.mutate(data.id);
      setIsFollowing(true);
    }
  };

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Image
            className="rounded-full"
            src={user?.profileImageUrl ?? "/images/png/placeholder-user.png"}
            alt={user?.fullName ?? ""}
            width={100}
            height={100}
          />
          <Typography as="h1" variant="heading" className="mb-10">
            Articles by {isMyPage ? "me" : user?.fullName}
          </Typography>
          <Button
            variant="primary"
            role="button"
            fullWidth
            onClick={handleFollow}
            className="mb-10"
          >
            <span className="m-0 flex w-full items-center rounded-l p-0">
              {isFollowing ? <BiMinusCircle /> : <BiPlusCircle />}
              <span className="ml-4 flex-1">
                {isFollowing ? "Unfollow" : "Follow"}
              </span>
            </span>
          </Button>
          <List>
            <ArticleList articles={articles} />
          </List>
        </>
      )}
    </Layout>
  );
};

export default ContributorPage;
