import { useEffect, useState } from "react";
import Image from "next/image";
import format from "date-fns/format";
import { type User, type Category } from "@prisma/client";
import Link from "~/components/Link";
import { remark } from "remark";
import html from "remark-html";
import Typography from "./Typography";
import Loading from "./Loading";
import Comments from "./Comments";
import ParallaxBox from "./ParallaxBox";
import { BiCalendar } from "react-icons/bi";

interface ArticleProps {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  author: User;
  date: Date;
  content: string;
  categories: Category[];
  comments?: boolean;
}

const Article = ({
  id,
  title,
  image = "/images/png/placeholder-article.png",
  author,
  date,
  content,
  categories,
  subtitle,
  comments = false,
}: ArticleProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  const renderContent = async () => {
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    setHtmlContent(contentHtml);
  };

  useEffect(() => {
    renderContent();
  }, [content]);

  if (!htmlContent) return <Loading />;
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <ParallaxBox image={image}>
        <Typography as="h1" variant="title" className="mb-8 w-full text-white">
          {title}
        </Typography>
        {subtitle && (
          <Typography className="italic text-white" variant="heading">
            {subtitle}
          </Typography>
        )}
      </ParallaxBox>
      <article className="pa max-w-none bg-gradient-to-br from-slate-300 via-slate-200 to-gray-200 p-6 dark:bg-slate-700">
        <Link href={`/contributors/${author.slug ?? ""}`} padding="p-0">
          <div className="flex items-end py-4">
            <Image
              src={author.image ?? "/images/png/placeholder-user.png"}
              alt={author.name ?? "Mr. Cool"}
              width={100}
              height={100}
              className="rounded-full"
            />
            <Typography
              variant="heading"
              className="pl-2"
              textColor="text-black"
            >
              {author.name}
            </Typography>
          </div>
        </Link>
        <span className="flex items-center">
          <BiCalendar size={18} color="#1F2937" />
          <Typography
            variant="subheading"
            textColor="text-gray-800"
            className="ml-2"
          >
            Published on {format(date, "MMMM do, yyyy, hh:mma")}
          </Typography>
        </span>
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="prose prose-zinc w-full dark:prose-invert lg:prose-xl"
        />
      </article>
      <Link href={`/contributors/${author.slug ?? ""}`}>
        <Typography
          as="h2"
          variant="subheading"
          className="ml-3 cursor-pointer font-medium  hover:text-blue-500"
        >
          Words supplied by {author.name ?? "Mr. Cool"}
        </Typography>
      </Link>
      <Typography as="h2" variant="subheading">
        Tags:
      </Typography>
      <ul className="flex py-6">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
      {comments && <Comments articleId={id} />}
    </div>
  );
};

export default Article;
