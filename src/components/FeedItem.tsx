import format from "date-fns/format";
import Image from "next/image";
import { Article, User, Category } from "@prisma/client";
import Typography from "./Typography";
import Button from "./Buttons/Button";
import Link from "./Link";

interface FeedItemProps {
  article: Article & {
    author: User;
    categories: Category[];
  };
}

export default function FeedItem({ article }: FeedItemProps) {
  return (
    <div className="mb-4 flex flex-col">
      <Link href={`/contributors/${article.author.slug}`}>
        <div className="flex flex-row">
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={article.author.image ?? "/images/png/placeholder-user.png"}
            alt={article.author.name ?? "placeholder"}
          />
          <div className="ml-3 flex flex-col">
            <Typography className="font-bold hover:text-blue-500">
              {article.author.name}
            </Typography>
            <span className="text-sm text-gray-500 hover:text-blue-500">
              {format(article.createdAt, "MMMM do, yyyy")}
            </span>
          </div>
        </div>
      </Link>
      <div className="mt-3 flex flex-col">
        <Typography className=" hover:text-blue-500">
          {article.title}
        </Typography>
        <span className="text-gray-500">
          {article.content.substring(0, 150)}...{" "}
          <div>
            <Link href={`/articles/${article.slug}`}>Read more</Link>
            Categories:
            {article.categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="capitalize"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </span>
      </div>
    </div>
  );
}
