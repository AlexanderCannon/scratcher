import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Category } from "@prisma/client";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import PhotoPicker from "~/components/PhotoPicker";
import Button from "~/components/Button";
import Select from "~/components/Select";
import Loading from "~/components/Loading";
import format from "date-fns/format";

export default function Editor() {
  const { query } = useRouter();

  if (!query.id) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  const id = typeof query.id === "string" ? query.id : query.id.join(", ");
  const { data: articleData, isLoading } = api.articles.getById.useQuery(id, {
    staleTime: Infinity,
  });
  const { data: categoryData } = api.categories.getAll.useQuery(undefined, {
    staleTime: Infinity,
  });
  const { data: sessionData } = useSession();

  useEffect(() => {
    const initialCategories = articleData?.categories ?? ([] as Category[]);
    setTitle(articleData?.title ?? "");
    setContent(articleData?.content ?? "");
    setFileUrl(articleData?.image ?? "");
    setPublished(articleData?.published ?? false);
    setArticleCategories(initialCategories);
  }, [articleData]);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>();
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);

  const updateArticle = api.articles.update.useMutation();
  const saveArticle = async () => {
    setSaving(true);
    updateArticle.mutate(
      {
        authorId: sessionData?.user.id ?? "",
        id: articleData?.id ?? "",
        title,
        content,
        image: fileUrl,
        categories: articleCategories.map(({ id }) => id),
        published,
      },
      {
        onSuccess: () => {
          setSaving(false);
        },
        onError: (error) => {
          console.error(error);
          setSaving(false);
        },
        onSettled: () => {
          setSaving(false);
        },
      }
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlePublish = () => {
    setPublished(!published);
    saveArticle();
  };

  const handleSave = () => saveArticle();

  const handlePreview = async () => {
    await saveArticle();
    window.open(
      `/articles/preview/${articleData?.slug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleFileChange = (url: string) => {
    setFileUrl(url);
  };

  if (!sessionData || !id) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }

  if (!articleData || isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout title="Edit your article">
      <pre>{articleData.published ? "Published" : "Draft"}</pre>{" "}
      <pre>
        Created on {format(articleData.createdAt, "MMMM do yy")}, last updated
        on{" "}
        {format(articleData.createdAt || articleData.createdAt, "MMMM do yy")}
      </pre>
      <input
        onChange={handleTitleChange}
        value={title}
        type="text"
        placeholder="Type your title here"
        className="w-full border-b border-none bg-transparent px-3 py-2 text-center text-5xl text-gray-700 focus:border-indigo-500 focus:outline-none"
      />
      <div className="bg- sticky top-16 z-40 w-full bg-white shadow">
        {categoryData ? (
          <Select
            initialValue={articleCategories}
            placeholder="Select categories"
            onChange={setArticleCategories}
            options={categoryData}
            optionLabel={(option) => option.name}
            optionValue={(option) => option.id}
          />
        ) : (
          <Loading />
        )}
        <PhotoPicker
          onSelect={handleFileChange}
          placeHolder={
            articleData.image ? "Replace your image" : "Add a cover photo"
          }
        />
        <div>
          <Button disabled={saving} onClick={handleSave}>
            Save
          </Button>
          <Button disabled={saving} onClick={handlePreview}>
            Preview
          </Button>
        </div>
        <div>
          <Button disabled={saving} onClick={handlePublish}>
            {published ? "Un-publish" : "Publish"}
          </Button>
        </div>
      </div>
      {articleData.image && !fileUrl && (
        <Image
          src={articleData.image}
          alt="heading image"
          width={1200}
          height={600}
        />
      )}
      {fileUrl && (
        <Image src={fileUrl} alt="heading image" width={1200} height={600} />
      )}
      <MarkdownEditor
        setContent={setContent}
        initialContent={articleData.content}
      />
    </Layout>
  );
}
