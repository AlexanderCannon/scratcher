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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import Button from "~/components/Button";
import placeholderUser from "../../public/images/png/placeholder-user.png";

const ContributorPage = () => {
  const { query } = useRouter();
  const { data: sessionData } = useSession();
  const [slug, setSlug] = useState<string>(query?.slug?.toString() ?? "");
  const { data, isLoading } = api.user.getBySlug.useQuery(slug);
  const isMyPage = sessionData?.user.id === data?.id;

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
  const { articles, ...user } = data;

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
            src={user.image ?? placeholderUser}
            alt={user.name ?? ""}
            width={100}
            height={100}
          />
          <Typography as="h1" variant="heading">
            Articles by {isMyPage ? "me" : user.name}
          </Typography>
          <Button variant="primary" role="button" onClick={handleFollow}>
            <p className="m-0 flex w-full items-center rounded-l p-4">
              {isFollowing ? <BiMinusCircle /> : <BiPlusCircle />}
              <span className="ml-4 flex-1">
                {isFollowing ? "Unfollow" : "Follow"}
              </span>
            </p>
          </Button>
          <List>
            {articles.map((article: Article) => (
              <ListItem key={article.id}>
                <Link href={`/articles/${article.slug}`}>
                  {/* <Typography
                    as="h2"
                    variant="subheading"
                    className="ml-3 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
                  > */}
                  {article.title}
                  {/* </Typography> */}
                </Link>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Layout>
  );
};

export default ContributorPage;
