import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Category } from "@prisma/client";
import format from "date-fns/format";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import PhotoPicker from "~/components/PhotoPicker";
import Button from "~/components/Buttons/Button";
import Select from "~/components/Select";
import Loading from "~/components/Loading";
import Toast from "~/components/Toast";
import Input from "~/components/Input";

interface Overrides {
  authorId?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  categories?: Category[];
  published?: boolean;
}

export default function Editor() {
  const router = useRouter();

  const id = router.query.id
    ? typeof router.query.id === "string"
      ? router.query.id
      : router.query.id.join(", ")
    : "";
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
    setSubtitle(articleData?.subtitle ?? "");
    setContent(articleData?.content ?? "");
    setFileUrl(articleData?.image ?? "");
    setPublished(articleData?.published ?? false);
    setArticleCategories(initialCategories);
  }, [articleData]);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>();
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(
    articleData?.published ?? false
  );
  const [showToast, setShowToast] = useState<boolean>(false);

  const updateArticle = api.articles.update.useMutation();
  const createArticle = api.articles.create.useMutation();
  const saveArticle = async (overrides?: Overrides) => {
    setSaving(true);
    if (!id) {
      createArticle.mutate(
        {
          authorId: sessionData?.user.id ?? "",
          title,
          subtitle,
          content,
          image: fileUrl,
          categories: articleCategories.map(({ id }) => id),
          published: overrides?.published ?? published,
        },
        {
          onSuccess: (data) => {
            setSaving(false);
            router.push(`/articles/edit/${data.id}`);
            setShowToast(true);
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
      return;
    }
    updateArticle.mutate(
      {
        authorId: sessionData?.user.id ?? "",
        id: articleData?.id ?? "",
        title,
        subtitle,
        content,
        image: fileUrl,
        categories: articleCategories.map(({ id }) => id),
        published: overrides?.published ?? published,
      },
      {
        onSuccess: () => {
          setSaving(false);
          setShowToast(true);
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
    saveArticle({ published: !published });
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

  if (!sessionData) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout title="Edit your article">
      {articleData && (
        <>
          <pre>{published ? "Published" : "Draft"}</pre>{" "}
          <pre>
            Created on {format(articleData.createdAt, "MMMM do yy")}, last
            updated on{" "}
            {format(
              articleData.createdAt || articleData.createdAt,
              "MMMM do yy"
            )}
          </pre>
        </>
      )}
      <input
        onChange={handleTitleChange}
        value={title}
        type="text"
        placeholder="Type your title here"
        className="w-full border-b border-none bg-transparent px-3 py-2 text-center text-5xl text-gray-700 focus:border-indigo-500 focus:outline-none"
      />
      <div className="bg- sticky top-16 z-40 w-full bg-white shadow">
        <Input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle"
          className="mb-2"
        />
        {categoryData ? (
          <Select
            className="mb-2"
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
            articleData?.image ? "Replace your image" : "Add a cover photo"
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
      {articleData?.image && !fileUrl && (
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
        initialContent={articleData?.content}
      />
      <Toast
        visible={showToast}
        message="Article saved successfully!"
        type="success"
        onClose={() => setShowToast(false)}
      />
    </Layout>
  );
}
