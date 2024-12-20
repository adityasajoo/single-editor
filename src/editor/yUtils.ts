/* eslint-disable @typescript-eslint/no-explicit-any */

import { Schema } from 'prosemirror-model'
import { yDocToProsemirrorJSON, prosemirrorJSONToYXmlFragment } from 'y-prosemirror'
import * as Y from 'yjs'

export function yDocToJSON(ydoc: Y.Doc, pmSchema: Schema): any {
  const yXmlFragment = ydoc.getXmlFragment('content')

  console.log('yXmlFragment', yXmlFragment)
  // Convert Y.Doc to ProseMirror JSON
  const doc = yDocToProsemirrorJSON(ydoc, "content")
  console.log('doc', doc)
  return doc
}

export function jsonToYDoc(json: any, targetYDoc: Y.Doc, pmSchema: Schema) {
  const yXmlFragment = targetYDoc.getXmlFragment('content')
  // Apply JSON content into targetYDoc via its fragment
  prosemirrorJSONToYXmlFragment(pmSchema, json, yXmlFragment)
}

export function extractSceneByIndex(docJSON: any, index: number): any {
  if (docJSON.content && docJSON.content[index] && docJSON.content[index].type === 'scene') {
    return { type: 'doc', content: [docJSON.content[index]] }
  }
  return { type: 'doc', content: [] }
}

