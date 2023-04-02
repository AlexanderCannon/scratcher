/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const mdParser = new MarkdownIt();

interface MarkdownEditorProps {
  setText: (text: string) => void;
}

export default function MarkdownEditor({ setText }: MarkdownEditorProps) {
  function handleEditorChange({ text }: { html: string; text: string }) {
    setText(text);
  }
  return (
    <MdEditor
      className="h-full w-full flex-grow"
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
}
