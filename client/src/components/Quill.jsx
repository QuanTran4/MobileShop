import React, { useCallback, useEffect, useRef, useState } from 'react';
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import axios from 'axios';

const Quill = ({description,toParent}) => {
  const reactQuillRef = useRef(null);
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "align",
  ];
  const [editContent, setEditContent] = useState();
  useEffect(() =>{
    setEditContent(description);
  },[])
  const handleChange = (e) =>{
    setEditContent(e);
    toParent(e);
  }
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const formData = new FormData();
        formData.append("file", input.files[0]);
        formData.append("upload_preset","MobileShop")
        axios.post(
            "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
            formData
        ).then((res) =>{
            const imgSrc = res.data.url;
          const quill = reactQuillRef.current;
          if (quill) {
            const range = quill.getEditorSelection();
            range &&
              quill.getEditor().insertEmbed(range.index, "image", imgSrc);
          }
        })
      }
    };
  }, []);
    return (
        <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        modules={{
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              // [{ header: "1" }, { header: "2" },{ header: "3" }, { header: "4" },{ header: "5" }, { font: [] }],
              [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
          clipboard: {
            matchVisual: false,
          },
        }}

        formats={formats}
        value={editContent}
        onChange={handleChange}
        required
      />
    );
};

export default Quill;