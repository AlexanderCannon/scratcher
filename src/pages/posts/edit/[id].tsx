import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Category } from "@prisma/client";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import ImageUploader from "~/components/ImageUploader";
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
  const { data: postData, isLoading } = api.posts.getById.useQuery(id, {
    staleTime: Infinity,
  });
  const { data: categoryData } = api.categories.getAll.useQuery(undefined, {
    staleTime: Infinity,
  });
  const { data: sessionData } = useSession();

  useEffect(() => {
    const initialCategories = postData?.categories ?? ([] as Category[]);
    setTitle(postData?.title ?? "");
    setContent(postData?.content ?? "");
    setFileUrl(postData?.image ?? "");
    setPublished(postData?.published ?? false);
    setArticleCategories(initialCategories);
  }, [postData]);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>();
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);

  const updatePost = api.posts.update.useMutation();
  const savePost = async (publish = false) => {
    setSaving(true);
    updatePost.mutate(
      {
        authorId: sessionData?.user.id ?? "",
        id: postData?.id ?? "",
        title,
        content,
        image: fileUrl,
        categories: articleCategories.map(({ id }) => id),
        published: publish,
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
    savePost(!postData?.published);
  };

  const handleSave = () => savePost(postData?.published ?? false);

  const handlePreview = () => {
    window.open(
      `/posts/preview/${postData?.slug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleFileChange = ([newFile]: File[]) => {
    if (newFile) {
      console.log("uploading file", newFile);
      setFileUrl("https://api.lorem.space/image/furniture?w=1200&h=600");
    }
  };

  if (!sessionData || !id) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }

  if (!postData || isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout title="Edit your post">
      <pre>{postData.published ? "Published" : "Draft"}</pre>{" "}
      <pre>
        Created on {format(postData.createdAt, "MMMM do yy")}, last updated on{" "}
        {format(postData.createdAt || postData.createdAt, "MMMM do yy")}
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
        <ImageUploader
          onUpload={handleFileChange}
          placeHolder={
            postData.image ? "Replace your image" : "Add a cover photo"
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
      {postData.image && !fileUrl && (
        <Image
          src={postData.image}
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
        initialContent={postData.content}
      />
    </Layout>
  );
}
