import { api } from "~/utils/api";
import Image from "next/image";
import Link from "~/components/Link";
import { Article, User } from "@prisma/client";
import { List } from "~/components/List";
import Typography from "~/components/Typography";
import { useEffect, useState } from "react";
import { BiMinusCircle, BiPlusCircle } from "react-icons/bi";
import Button from "~/components/Buttons/Button";
import ArticleList from "~/components/ArticleList";
import Card from "./Card";

interface ContributorProfileProps {
  user: User & { articles?: Article[] };
}

const ContributorProfile = ({ user }: ContributorProfileProps) => {
  const { id, articles } = user;
  const { data: followingData } = api.follows.isFollowing.useQuery(id);
  const follow = api.follows.follow.useMutation();
  const unfollow = api.follows.unfollow.useMutation();

  const [isFollowing, setIsFollowing] = useState<boolean>(
    followingData ?? false
  );

  useEffect(() => {
    setIsFollowing(followingData ?? false);
  }, [followingData]);

  const handleFollow = () => {
    if (isFollowing) {
      unfollow.mutate(id);
      setIsFollowing(false);
    } else {
      follow.mutate(id);
      setIsFollowing(true);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex flex-col items-center md:flex-row">
        <div className="flex-shrink-0">
          <Link padding="p-0" href={`/contributors/${user.slug}`}>
            <Image
              height={100}
              width={100}
              className="rounded-full"
              src={user.image ?? "/images/png/placeholder-user.png"}
              alt={user.name ?? "placeholder image"}
            />
          </Link>
        </div>
        <div className="ml-4">
          <Link padding="p-0" href={`/contributors/${user.slug}`}>
            <Typography
              variant="subheading"
              as="h2"
              className="hover:text-blue-500"
            >
              {user.name}
            </Typography>
          </Link>
          <Link padding="p-0" href={`/contributors/${user.slug}`}>
            <p className="text-gray-500 hover:text-blue-500">{user.username}</p>
          </Link>
        </div>
      </div>
      {user.bio && (
        <Typography as="p" variant="body" className="mb-4">
          {user.bio}
        </Typography>
      )}
      <Button variant="primary" role="button" fullWidth onClick={handleFollow}>
        <span className="m-0 flex w-full items-center rounded-l p-0">
          {isFollowing ? <BiMinusCircle /> : <BiPlusCircle />}
          <span className="ml-4 flex-1">
            {isFollowing ? "Unfollow" : "Follow"}
          </span>
        </span>
      </Button>
      {articles && (
        <List>
          <ArticleList articles={articles} />
        </List>
      )}
    </Card>
  );
};

export default ContributorProfile;
