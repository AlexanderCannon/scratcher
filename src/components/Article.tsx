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
import ParserBlock from "markdown-it/lib/parser_block";

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
      <Link href={`/contributors/${author.slug ?? ""}`} padding="p-0">
        <div className="flex items-end py-4">
          <Image
            src={author.image ?? "/images/png/placeholder-user.png"}
            alt={author.name ?? "Mr. Cool"}
            width={100}
            height={100}
            className="rounded-full"
          />
          <Typography variant="heading" className="pl-2">
            {author.name}
          </Typography>
        </div>
      </Link>
      <span className="flex items-center">
        <BiCalendar size={18} />
        <Typography
          variant="subheading"
          textColor="text-gray-600"
          className="ml-2"
        >
          Published on {format(date, "MMMM do, yyyy, hh:mma")}
        </Typography>
      </span>
      <article className="pa prose max-w-none bg-slate-100 p-6 lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
