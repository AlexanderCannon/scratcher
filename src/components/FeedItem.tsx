import format from "date-fns/format";
import Image from "next/image";
import { Article, User, Category } from "@prisma/client";
import Typography from "./Typography";
import Markdown from "./Markdown";
import NextLink from "next/link";
import Link from "./Link";
import { useRouter } from "next/router";
import { MouseEvent, useRef } from "react";

interface FeedItemProps {
  article: Article & {
    author: User;
    categories: Category[];
  };
}

export default function FeedItem({ article }: FeedItemProps) {
  const router = useRouter();
  const handleClick = (event: MouseEvent) => {
    const clickedElement = event.target as Element;
    event.stopPropagation();
    event.preventDefault();
    console.log(clickedElement.tagName);
    if (clickedElement.tagName !== "IMG" && clickedElement.tagName !== "A") {
      router.push(`/articles/${article.slug}`);
    }
  };

  return (
    <div
      className="flex w-full cursor-pointer flex-col p-4 pt-6 shadow hover:bg-gray-200"
      onClick={handleClick}
    >
      <div className="flex flex-row">
        <NextLink href={`/contributors/${article.author.slug}`} className="p-0">
          <Image
            width={50}
            height={50}
            className="rounded-full"
            src={article.author.image ?? "/images/png/placeholder-user.png"}
            alt={article.author.name ?? "placeholder"}
          />
        </NextLink>
        <div className="ml-3 flex flex-col">
          <NextLink
            href={`/contributors/${article.author.slug}`}
            className="font-bold hover:text-blue-500"
          >
            {article.author.name}
          </NextLink>
          <NextLink
            href={`/articles/${article.slug}`}
            className="text-sm text-gray-500 hover:text-blue-500"
          >
            {format(article.createdAt, "MMMM do, yyyy")}
          </NextLink>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <Typography className=" hover:text-blue-500">
          {article.title}
        </Typography>
        <span className="text-gray-500">
          <Markdown content={article.intro + "..."} />
          <div className="mt-2">
            <Link href={`/articles/${article.slug}`} padding="p-0">
              Read more
            </Link>
            <span className="ml-4">
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
            </span>
          </div>
        </span>
      </div>
    </div>
  );
}
