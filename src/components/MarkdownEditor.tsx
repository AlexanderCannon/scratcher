/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  setContent: (text: string) => void;
}

export default function MarkdownEditor({ setContent }: MarkdownEditorProps) {
  function handleEditorChange({ text }: { html: string; text: string }) {
    setContent(text);
  }
  return (
    <MdEditor
      className="h-full w-full flex-grow"
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
}
