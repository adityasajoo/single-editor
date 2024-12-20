/* eslint-disable @typescript-eslint/no-explicit-any */
// editor/SchemaContext.tsx
import React, { createContext, useContext } from 'react'
import { Schema } from 'prosemirror-model'

interface SchemaContextValue {
  pmSchema: Schema | null
  setPmSchema: (schema: Schema) => void
}

const SchemaContext = createContext<SchemaContextValue | undefined>(undefined)

export const SchemaProvider: React.FC<any> = ({ children }) => {
  const [pmSchema, setPmSchema] = React.useState<Schema | null>(null)

  return (
    <SchemaContext.Provider value={{ pmSchema, setPmSchema }}>
      {children}
    </SchemaContext.Provider>
  )
}

export const useSchemaContext = () => {
  const context = useContext(SchemaContext)
  if (!context) {
    throw new Error('useSchemaContext must be used within a SchemaProvider')
  }
  return context
}
