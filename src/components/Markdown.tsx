import React from "react";
import { remark } from "remark";
import html from "remark-html";

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  console.log(content);
  const htmlContent = remark().use(html).processSync(content).toString();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default Markdown;
