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
      <div
        className="h-80 min-h-fit bg-cover bg-fixed bg-center bg-no-repeat md:h-96"
        style={{
          backgroundImage: `url(${image})`,
          position: "relative",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "1",
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: "blur(10px)",
            zIndex: "-1",
          }}
        ></div>
        <div className="absolute left-1/2 top-1/2 z-10 w-11/12 -translate-x-1/2 -translate-y-1/2 transform text-center text-white md:w-2/3">
          <Typography
            as="h1"
            variant="title"
            className="mb-8 w-full text-white"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography className="italic text-white" variant="heading">
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
      <Link href={`/contributors/${author.slug ?? ""}`} padding="p-0">
        <div className="mb-2 flex items-end pt-2">
          <Image
            src={author.image ?? "/images/png/placeholder-user.png"}
            alt={author.name ?? "Mr. Cool"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <Typography variant="subheading">{author.name}</Typography>
        </div>
      </Link>
      <Typography variant="body" className="text-gray-600">
        {format(date, "MMMM do, yyyy")}
      </Typography>
      <article className="pa prose max-w-none bg-slate-100 p-6 lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
      <Link href={`/contributors/${author.slug ?? ""}`}>
        <Typography
          as="h2"
          variant="subheading"
          className="ml-3 cursor-pointer font-medium text-gray-400 hover:text-gray-500"
        >
          Words supplied by {author.name ?? "Mr. Cool"}
        </Typography>
      </Link>
      <Typography as="h2" variant="subheading">
        Tags:
      </Typography>
      <ul className="flex">
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
