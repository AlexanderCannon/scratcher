import { format } from "date-fns";
import { Article, User, Category } from "@prisma/client";
import Image from "next/image";
import Link from "~/components/Link";
import Typography from "~/components/Typography";
import Card from "~/components/Card";

interface ArticleListProps {
  articles: (Article & {
    author?: User;
    categories?: Category[];
  })[];
  user?: User;
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <>
      {articles.map((article) => (
        <Card className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {article.author && (
            <Link
              href={`/contributors/${article.author.slug}`}
              className="col-span-1 flex flex-col items-center justify-center"
            >
              <Image
                src={article.author.image ?? "/images/png/placeholder-user.png"}
                alt={article.author.name ?? "Mr. Cool"}
                width={100}
                height={100}
                className="rounded-full"
              />
              <Typography
                as="h2"
                variant="body"
                className=" hover:text-blue-500"
              >
                {article.author.name}
              </Typography>
              <Typography>{format(article.createdAt, "MMMM do")}</Typography>
            </Link>
          )}
          <div className={article.author ? "col-span-3" : "col-span-4"}>
            <Link href={`/articles/${article.slug}`}>
              <Typography
                as="h1"
                variant="subheading"
                className="cursor-pointer font-medium text-gray-400 hover:text-blue-500"
              >
                {article.title}
              </Typography>
            </Link>
            <Link href={`/articles/${article.slug}`}>
              <Typography>
                {article.intro}...
                <span className="ml-1 hover:text-blue-500"> Read More</span>
              </Typography>
            </Link>
            {article.categories && (
              <div className="flex flex-wrap">
                {article.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="mb-2 mr-2 rounded-full px-2 py-1 text-sm capitalize text-gray-700 shadow hover:bg-gray-100 hover:shadow-lg"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </>
  );
}
