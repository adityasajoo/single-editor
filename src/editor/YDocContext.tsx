/* eslint-disable @typescript-eslint/no-explicit-any */
// editor/YDocContext.tsx
import React, { createContext, useContext } from 'react'
import * as Y from 'yjs'

interface YDocContextValue {
  mainYDoc: Y.Doc
  content: Y.XmlFragment
}

const YDocContext = createContext<YDocContextValue | undefined>(undefined)

export const YDocProvider: React.FC<any> = ({ children }) => {
  const mainYDoc = new Y.Doc()
  const content = mainYDoc.getXmlFragment('content')

  return (
    <YDocContext.Provider value={{ mainYDoc, content }}>
      {children}
    </YDocContext.Provider>
  )
}

export const useYDoc = () => {
  const context = useContext(YDocContext)
  if (!context) {
    throw new Error('useYDoc must be used within a YDocProvider')
  }
  return context
}
