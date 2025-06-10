import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePageContent } from "@/api/admin/pages";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import ReactQuill from "react-quill"; // You'll need to install react-quill
import "react-quill/dist/quill.snow.css";
import { LoadingSpinner } from "@/components/my-ui/Loader";

interface PageEditorProps {
  pageName: string;
  initialTitle: string;
  initialContent: string;
  onSave: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  pageName,
  initialTitle,
  initialContent,
  onSave,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      showErrorToast("Page title cannot be empty");
      return;
    }

    if (!content.trim()) {
      showErrorToast("Page content cannot be empty");
      return;
    }

    const result = await updatePageContent(pageName, title, content, setLoading);
    
    if (result.success) {
      showSuccessToast(result.message);
      onSave();
    } else {
      showErrorToast(result.message);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <Card className="bg-gradient-to-r from-black to-[#1A1A1A] border-[#BBF429] text-white">
      <CardHeader>
        <CardTitle className="text-[#BBF429]">Edit {pageName.replace('_', ' ').toUpperCase()} Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            className="bg-black/30 border-[#BBF429] text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Page Content</label>
          <div className="bg-black/30 rounded-md border border-[#BBF429]">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="text-white bg-transparent quill-editor-dark"
              theme="snow"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#BBF429] hover:bg-[#a9e01c] text-black"
          >
            {loading ? <LoadingSpinner size={20} color="black" /> : "Save Page"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;