import Image from "next/image";
import Typography from "./Typography";
import format from "date-fns/format";
import { type User, type Category } from "@prisma/client";
import Link from "next/link";
import Markdown from "./Markdown";

interface BlogPostProps {
  title: string;
  image: string;
  author: User;
  date: Date;
  content: string;
  categories: Category[];
}

const BlogPost = ({
  title,
  image,
  author,
  date,
  content,
  categories,
}: BlogPostProps) => {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="mb-8">
        <Image src={image} alt={title} width={1200} height={600} />
      </div>
      <div className="mb-8">
        <Typography as="h1" variant="heading" className="mb-2">
          {title}
        </Typography>
        <div className="mb-2 flex items-center">
          <Image
            src={author.image ?? "https://api.lorem.space/image/face?w=50&h=50"}
            alt={author.name ?? "Mr. Cool"}
            width={40}
            height={40}
            className="mr-2 rounded-full"
          />
          <Typography variant="subheading">{author.name}</Typography>
        </div>
        <Typography variant="body" className="text-gray-600">
          {format(date, "MMMM do, yyyy")}
        </Typography>
      </div>
      <article className="prose max-w-none lg:prose-xl">
      <MDXProvider components={components}>
        <html dangerouslySetInnerHTML={{ __html: content }} />
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
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Typography as="h2" variant="subheading">
              Tags:
            </Typography>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPost;
