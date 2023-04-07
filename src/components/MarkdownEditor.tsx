/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  setContent: (text: string) => void;
  initialContent?: string;
}

export default function MarkdownEditor({
  setContent,
  initialContent,
}: MarkdownEditorProps) {
  function handleEditorChange({ text }: { html: string; text: string }) {
    setContent(text);
    setValue(text);
  }

  useEffect(() => {
    if (initialContent) {
      setValue(initialContent);
    }
  }, [initialContent]);

  const [value, setValue] = React.useState(initialContent ?? "");

  return (
    <MdEditor
      value={value}
      className="h-full w-full flex-grow"
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
}
