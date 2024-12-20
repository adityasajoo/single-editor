// editor/SingleSceneEditor.tsx
import { Collaboration } from '@tiptap/extension-collaboration'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as Y from 'yjs'

import { Doc } from './nodes/DocNode'
import { SceneContent } from './nodes/SceneContentNode'
import { SceneHeading } from './nodes/SceneHeadingNode'
import { Scene } from './nodes/SceneNode'
import { prosemirrorJSONToYXmlFragment, yDocToProsemirrorJSON } from 'y-prosemirror'
import { useSchemaContext } from './SchemaContext'
import { useYDoc } from './YDocContext'
import { extractSceneByIndex, jsonToYDoc, yDocToJSON } from './yUtils'

export const SingleSceneEditor: React.FC = () => {
  const { mainYDoc } = useYDoc()
  const { pmSchema } = useSchemaContext()
  const { index } = useParams<{ index: string }>()
  const sceneIndex = parseInt(index || '0', 10)
  const navigate = useNavigate()

  const [sceneYDoc] = useState(() => new Y.Doc())
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!pmSchema) return
    if (!mainYDoc) return

    console.log('mainYDoc', mainYDoc.getSubdocs());
    // Convert main doc to JSON
    const mainJson = yDocToJSON(mainYDoc, pmSchema)
    const sceneJson = extractSceneByIndex(mainJson, sceneIndex)

    if (!sceneJson.content || sceneJson.content.length === 0) {
      // Scene not found, go back
      console.warn('No scene found at index:', sceneIndex, 'Doc content:', mainJson)
      navigate('/')
      return
    }

    // Load scene into a fresh Y.Doc for the single scene
    jsonToYDoc(sceneJson, sceneYDoc, pmSchema)
    setInitialized(true)
  }, [pmSchema, mainYDoc, sceneIndex, navigate, sceneYDoc])

  const editor = useEditor({
    extensions: [
      Doc,
      StarterKit.configure({ heading: false, document: false, history: false }),
      Scene,
      SceneHeading,
      SceneContent,
      Collaboration.configure({
        document: sceneYDoc,
        field: 'content'
      }),
    ],
  }, [initialized]) 

  const handleSave = () => {
    if (!pmSchema) return
  
    // Convert the sceneYDoc back to PM JSON
    const sceneDocJSON = yDocToProsemirrorJSON(sceneYDoc, 'content')
  
    // The sceneDocJSON should look like { type: "doc", content: [ { type: "scene", ... } ] }
    const updatedScene = sceneDocJSON.content && sceneDocJSON.content[0]
    if (!updatedScene) {
      console.warn("No updated scene found in sceneYDoc")
      navigate('/')
      return
    }
  
    // 2. Convert mainYDoc to PM JSON
    const mainDocJSON = yDocToProsemirrorJSON(mainYDoc, 'content')
    
    // Ensure mainDocJSON has content array
    if (!mainDocJSON.content) {
      console.warn("Main doc has no content")
      navigate('/')
      return
    }
  
    // 3. Replace the scene at sceneIndex in the main doc
    if (sceneIndex < 0 || sceneIndex >= mainDocJSON.content.length) {
      console.warn("Scene index out of range:", sceneIndex)
      navigate('/')
      return
    }
  
    // Replace that scene in the main doc
    mainDocJSON.content[sceneIndex] = updatedScene
  
    // 4. Clear the mainYDoc fragment and reapply the updated mainDocJSON
    const mainFragment = mainYDoc.getXmlFragment('content')
    mainFragment.delete(0, mainFragment.length) // remove old content
    prosemirrorJSONToYXmlFragment(pmSchema, mainDocJSON, mainFragment)
    
    navigate('/')
  }

  return (
    <div style={{ padding: '1em' }}>
      <button onClick={handleSave}>Back to Main</button>
      <h2>Editing Scene {sceneIndex + 1}</h2>
      {pmSchema && initialized && editor && <EditorContent editor={editor} />}
      {!initialized && <p>Loading scene...</p>}
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
  )
}
