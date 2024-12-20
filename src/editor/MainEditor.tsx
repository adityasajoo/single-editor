/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Collaboration } from '@tiptap/extension-collaboration'

import { Doc } from './nodes/DocNode'
import { Scene } from './nodes/SceneNode'
import { SceneHeading } from './nodes/SceneHeadingNode'
import { SceneContent } from './nodes/SceneContentNode'
import { DoubleEnterExtension } from './extensions/doubleEnterExtension' 

import { SceneList } from './components/SceneList'
import { useYDoc } from './YDocContext'
import { useSchemaContext } from './SchemaContext'

export const MainEditor: React.FC = () => {
  const { mainYDoc } = useYDoc()
  const { setPmSchema } = useSchemaContext()
  const [sceneHeadings, setSceneHeadings] = useState<string[]>([])

  const editor = useEditor({
    extensions: [
      Doc,
      StarterKit.configure({ heading: false, document: false, history: false }),
      Scene,
      SceneHeading,
      SceneContent,
      DoubleEnterExtension,
      Collaboration.configure({
        document: mainYDoc,
        field: 'content'
      }),
    ],
    onCreate({ editor }) {
      setPmSchema(editor.schema)
    }
  })

  useEffect(() => {
    if (!editor) return

    const updateHeadings = () => {
      const json = editor.getJSON()
      const headings: string[] = []
      json.content?.forEach((node: any) => {
        if (node.type === 'scene') {
          const headingNode = node.content.find((c: any) => c.type === 'sceneHeading')
          if (headingNode && headingNode.content) {
            const text = headingNode.content.map((t: any) => t.text || '').join('')
            headings.push(text)
          }
        }
      })
      setSceneHeadings(headings)
    }

    editor.on('update', updateHeadings)
    updateHeadings()

    return () => {
      editor.off('update', updateHeadings)
    }
  }, [editor])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <SceneList headings={sceneHeadings} />
      <div className="editor-container" style={{ flex: 1, padding: '1em' }}>
        {editor && <EditorContent editor={editor} />}
        <style>{`
          .scene {
            margin-bottom: 2em;
            padding: 1em;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .scene-heading {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0 0 0.5em 0;
          }
          .scene-content {
            min-height: 2em;
          }
        `}</style>
      </div>
    </div>
  )
}
