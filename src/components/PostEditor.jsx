import React, { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function PostEditor({
  conteudo,
  setConteudo,
  editorRef,
  visualizar,
}) {
  useEffect(() => {
    if (
      !visualizar &&
      editorRef?.current &&
      conteudo !== editorRef.current.getContent()
    ) {
      console.log("Sincronizando conteúdo:", conteudo);
      editorRef.current.setContent(conteudo);
    }
  }, [visualizar, editorRef, conteudo]);

  return (
    !visualizar && (
      <Editor
        apiKey="2ngmlqomnasqjcpbm8ra99mcefs0eici0cw21yvk0c0i0myc"
        onEditorChange={(content, editor) => setConteudo(content)}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          console.log("Editor inicializado. Conteúdo inicial:", conteudo);
          if (conteudo) {
            editor.setContent(conteudo);
          }
          editor.getBody().style.direction = "ltr";
          editor.getBody().style.textAlign = "left";
        }}
        init={{
          language: "pt_BR",
          plugins: [
            "image",
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
          ],
          toolbar:
            "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image link",
          content_style: `
          body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              width: 80%;
              margin: 2rem auto;
              padding: 0;
              box-sizing: border-box;
              text-align: left !important;
              direction: ltr !important;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block; /* Garante que a imagem seja tratada como bloco */
              margin: 0 auto; /* Centraliza a imagem horizontalmente */
            }
            figure {
              max-width: 100%;
              margin: 1em auto;
              text-align: center;
            }
            figcaption {
              font-size: 0.9rem;
              font-style: italic;
              color: #666;
              text-align: center;
            }
            * {
              direction: ltr !important;
              text-align: inherit;
            }
          `,
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = () => {
                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                  const id = "blobid" + new Date().getTime();
                  // Corrigido: Removido getInstance()
                  const blobCache = editorRef.current.editorUpload.blobCache;
                  const base64 = reader.result.split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  // Chama o callback com a URL da imagem
                  callback(blobInfo.blobUri(), { alt: file.name });
                };

                reader.readAsDataURL(file);
              };

              input.click();
            }
          },
          setup: (editor) => {
            editor.on("init", () => {
              editor.getBody().dir = "ltr";
              editor.getBody().style.direction = "ltr";
            });
            editor.on("NodeChange", () => {
              editor.getBody().dir = "ltr";
              editor.getBody().style.direction = "ltr";
            });
          },
        }}
      />
    )
  );
}
