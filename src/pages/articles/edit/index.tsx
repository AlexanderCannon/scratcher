import { useState } from "react";
import { Category } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import PhotoPicker from "~/components/PhotoPicker";
import Button from "~/components/Buttons/Button";
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
  const [image, setImage] = useState<string>();
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
        image,
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

  const handleFileChange = (url: string) => {
    setImage(url);
  };

  if (!sessionData)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout title="Create an article">
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

        <PhotoPicker onSelect={handleFileChange} />
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
      {image && (
        <Image src={image} width={990} height={495} alt="selected image" />
      )}
      <MarkdownEditor setContent={setContent} />
    </Layout>
  );
}
