import { useEffect, useState } from "react";
import Image from "next/image";
import format from "date-fns/format";
import { type User, type Category } from "@prisma/client";
import Link from "~/components/Link";
import { remark } from "remark";
import html from "remark-html";
import Typography from "./Typography";
import Loading from "./Loading";
import placeholderUser from "../../public/images/png/placeholder-user.png";

interface ArticleProps {
  title: string;
  image?: string;
  author: User;
  date: Date;
  content: string;
  categories: Category[];
}

const Article = ({
  title,
  image,
  author,
  date,
  content,
  categories,
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
    <div className="mx-auto max-w-5xl px-4">
      <div className="mb-8">
        {image && <Image src={image} alt={title} width={1200} height={600} />}
      </div>
      <Typography as="h1" variant="heading" className="mb-2">
        {title}
      </Typography>
      <Link href={author.slug ?? ""} padding="p-0">
        <div className="mb-2 flex items-center">
          <Image
            src={author.image ?? placeholderUser}
            alt={author.name ?? "Mr. Cool"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <Typography variant="subheading">{author.name}</Typography>
        </div>
        <Typography variant="body" className="text-gray-600">
          {format(date, "MMMM do, yyyy")}
        </Typography>
      </Link>
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
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Article;
