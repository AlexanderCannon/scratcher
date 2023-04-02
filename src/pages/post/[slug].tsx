import { useRouter } from "next/router";
import { api } from "../../utils/api";

export default function PostPage() {
  const { query } = useRouter();

  if (!query.slug) {
    return <div>not found</div>;
  }
  const slug =
    typeof query.slug === "string" ? query.slug : query.slug.join(", ");
  const { data } = api.posts.getBySlug.useQuery(slug);
  if (data)
    return (
      <div>
        <h1>{data.title}</h1>
        <p>{data.content}</p>
      </div>
    );
}
