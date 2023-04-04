import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import ImageUploader from "~/components/ImageUploader";
import Button from "~/components/Button";
import Select from "~/components/Select";
import Loading from "~/components/Loading";
import { Category } from "@prisma/client";

export default function Editor() {
  const [postId, setPostId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>();
  const [articleCategories, setArticleCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const { data: categoryData } = api.categories.getAll.useQuery();

  const { data: createdPost } = api.posts.getById.useQuery(postId);
  const { data: sessionData } = useSession();

  const createPost = api.posts.create.useMutation();
  const updatePost = api.posts.update.useMutation();
  const handleSave = async () => {
    setSaving(true);
    if (!createdPost) {
      createPost.mutate(
        {
          authorId: sessionData?.user.id ?? "",
          title,
          content,
          image: fileUrl,
          categories: articleCategories.map(({ id }) => id),
        },
        {
          onSuccess: (data) => {
            setPostId(data.id);
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
    }
    updatePost.mutate(
      {
        authorId: sessionData?.user.id ?? "",
        id: postId,
        title,
        content,
        image: fileUrl,
        categories: articleCategories.map(({ id }) => id),
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
    console.log(content);
  };

  const handleFileChange = ([newFile]: File[]) => {
    console.log("uploading file", newFile);
    setFileUrl("https://picsum.photos/1000");
  };

  if (!sessionData)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout title="Create a post">
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
          <Button disabled={!saving} onClick={handleSave}>
            Save
          </Button>
          <Button disabled={!saving} onClick={handleSave}>
            Preview
          </Button>
        </div>
        <div>
          <Button disabled={!saving} onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>
      <MarkdownEditor setContent={setContent} />
    </Layout>
  );
}
