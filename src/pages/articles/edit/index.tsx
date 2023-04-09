import { useState } from "react";
import { Category } from "@prisma/client";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import ImageUploader from "~/components/ImageUploader";
import Button from "~/components/Button";
import Select from "~/components/Select";
import Loading from "~/components/Loading";

export default function Editor() {
  const { data: categoryData } = api.categories.getAll.useQuery(undefined, {
    staleTime: Infinity,
  });
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>();
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const createArticle = api.articles.create.useMutation();

  const saveArticle = async (publish = false) => {
    setSaving(true);
    createArticle.mutate(
      {
        authorId: sessionData?.user.id ?? "",
        title,
        content,
        image: fileUrl,
        categories: articleCategories.map(({ id }) => id),
        published: publish,
      },
      {
        onSuccess: (data) => {
          router.push(`/articles/edit/${data.id}`);
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

  const handleSave = () => saveArticle(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlePublish = () => {
    saveArticle(true);
  };

  const handlePreview = () => {
    return "please save your article first";
  };

  const handleFileChange = ([newFile]: File[]) => {
    if (newFile) {
      console.log("uploading file", newFile);
      setFileUrl("https://api.lorem.space/image/games?w=1200&h=600");
    }
  };

  if (!sessionData)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout title="Create a article">
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
            placeholder="Select categories"
            onChange={setArticleCategories}
            options={categoryData}
            optionLabel={(option) => option.name}
            optionValue={(option) => option.id}
          />
        ) : (
          <Loading />
        )}

        <ImageUploader onUpload={handleFileChange} />
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
            Publish
          </Button>
        </div>
      </div>
      <MarkdownEditor setContent={setContent} />
    </Layout>
  );
}
