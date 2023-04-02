import { useState } from "react";
import Layout from "~/components/Layout";
import MarkdownEditor from "~/components/MarkdownEditor";
import { useSession } from "next-auth/react";
import NotFound from "~/components/NotFound";
import Typography from "~/components/Typography";
import Input from "~/components/Input";

export default function Editor() {
  const { data: sessionData } = useSession();
  const [text, setText] = useState<string>("");

  const handleSave = () => {
    console.log(text);
  };

  if (!sessionData)
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  return (
    <Layout title="Create a post">
      <Typography as="h1" variant="heading">
        Create a new post
      </Typography>
      <Input type="text" placeholder="Title" />
      <button onClick={handleSave}>Save</button>
      <MarkdownEditor setText={setText} />
    </Layout>
  );
}
