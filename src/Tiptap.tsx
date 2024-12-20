/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const Tiptap = () => {
    const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [editingParagraphIndex, setEditingParagraphIndex] = useState<number | null>(null);
  const [paragraphEditors, setParagraphEditors] = useState<{ [key: number]: Editor }>({});

  //main editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      updateParagraphsFromEditorContent(editor);
    },
  });

  // Reference to the editor
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);


  const updateParagraphsFromEditorContent = (editorInstance: Editor) => {
    const json = editorInstance.getJSON();
    const paras = json.content
      ? json.content
          .filter(item => item.type === 'paragraph')
          .map(item => {
            return item.content
              ? item.content.map((textNode: any) => textNode.text).join('')
              : '';
          })
      : [];
    setParagraphs(paras);
  };


  const startEditingParagraph = (index: number, content: string) => {
    const newParagraphEditor = new Editor({
      extensions: [StarterKit],
      content: content,
      onUpdate: ({ editor: paragraphEditor }) => {
        const updatedContent = paragraphEditor.getJSON();

        if (editorRef.current) {
          const mainEditorContent = editorRef.current.getJSON();

          if (mainEditorContent.content && mainEditorContent.content[index]) {
            if(updatedContent.content&&updatedContent.content.length > 0)
            mainEditorContent.content[index] = updatedContent.content[0];
            editorRef.current.commands.setContent(mainEditorContent);
            // **Fix:** Update the paragraphs state after changing the main editor's content
            updateParagraphsFromEditorContent(editorRef.current);
          }
        }
      },
      onBlur: () => {
        // Stop editing when the editor loses focus
        setEditingParagraphIndex(null);
      },
    });

    // Store the paragraph editor instance
    setParagraphEditors(prev => ({
      ...prev,
      [index]: newParagraphEditor,
    }));

    setEditingParagraphIndex(index);
  };

  return (
    <div>
      <h2>Min Editor</h2>
      <EditorContent editor={editor} />
      <h3 style={{marginTop:"50px"}}>Paragraphs:</h3>
      <div>
        <ol>
        {paragraphs.map((para, index) => (
          <div key={index}>
            {editingParagraphIndex === index ? (
              <EditorContent editor={paragraphEditors[index]} />
            ) : (
             <li> <p onClick={() => startEditingParagraph(index, para)}>{para}</p></li>
            )}
          </div>
        ))}
        </ol>
      </div>
    </div>
  );
};

export default Tiptap;
