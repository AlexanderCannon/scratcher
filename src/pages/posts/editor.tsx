import MdEditor from "@uiw/react-md-editor";

interface PageEditorProps {
  initialContent?: string;
  onSave: (newContent: string) => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  initialContent = "",
  onSave,
}) => {
  const [content, setContent] = useState<string>(initialContent);

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div>
      <MdEditor value={content} onChange={setContent} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default PageEditor;
