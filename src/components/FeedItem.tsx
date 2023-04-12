import format from "date-fns/format";
import Image from "next/image";
import { Article, User, Category } from "@prisma/client";
import Typography from "./Typography";
import Markdown from "./Markdown";
import Link from "./Link";

interface FeedItemProps {
  article: Article & {
    author: User;
    categories: Category[];
  };
}

export default function FeedItem({ article }: FeedItemProps) {
  return (
    <div className="mb-6 flex w-full flex-col p-4 shadow">
      <div className="flex flex-row">
        <Link href={`/contributors/${article.author.slug}`} padding="p-0">
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={article.author.image ?? "/images/png/placeholder-user.png"}
            alt={article.author.name ?? "placeholder"}
          />
        </Link>
        <div className="ml-3 flex flex-col">
          <Link href={`/contributors/${article.author.slug}`} padding="p-0">
            <Typography className="font-bold hover:text-blue-500">
              {article.author.name}
            </Typography>
          </Link>
          <Link href={`/articles/${article.slug}`} padding="p-0">
            <span className="text-sm text-gray-500 hover:text-blue-500">
              {format(article.createdAt, "MMMM do, yyyy")}
            </span>
          </Link>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <Typography className=" hover:text-blue-500">
          {article.title}
        </Typography>
        <span className="text-gray-500">
          <Markdown content={article.intro + "..."} />
          <div className="mt-2">
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
