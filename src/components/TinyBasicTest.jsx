import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyBasicTest() {
  const editorRef = useRef(null);

  const handleSave = () => {
    if (editorRef.current) {
      console.log("Conteúdo atual:", editorRef.current.getContent());
    }
  };

  return (
    <div>
      <h2>Teste Básico do TinyMCE</h2>
      <Editor
        apiKey="2ngmlqomnasqjcpbm8ra99mcefs0eici0cw21yvk0c0i0myc"
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 300,
          menubar: false,
          toolbar: "undo redo | bold italic underline",
        }}
      />
      <button onClick={handleSave}>Salvar Conteúdo</button>
    </div>
  );
}