import format from "date-fns/format";
import Image from "next/image";
import { Article, User, Category } from "@prisma/client";
import Typography from "./Typography";
import Link from "./Link";

interface FeedItemProps {
  article: Article & {
    author: User;
    categories: Category[];
  };
}

export default function FeedItem({ article }: FeedItemProps) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="mb-4 flex flex-col">
        <div className="flex flex-row">
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={
              article.author.image ??
              "https://api.lorem.space/image/face?w=50&h=50"
            }
            alt={article.author.name ?? ""}
          />
          <div className="ml-3 flex flex-col">
            <Typography className="font-bold">{article.author.name}</Typography>
            <span className="text-sm text-gray-500">
              {format(article.createdAt, "MMMM do, yyyy")}
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-col">
          <Typography>{article.title}</Typography>
          <span className="text-gray-500">
            {article.content.substring(0, 150)}...
          </span>
        </div>
      </div>
    </Link>
  );
}
