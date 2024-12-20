import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { YDocProvider } from './editor/YDocContext'
import { MainEditor } from './editor/MainEditor'
import { SingleSceneEditor } from './editor/SingleSceneEditor'
import { SchemaProvider } from './editor/SchemaContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainEditor />,
  },
  {
    path: '/scene/:index',
    element: <SingleSceneEditor />,
  },
])

 const App: React.FC = () => {
  return (
    <YDocProvider>
      <SchemaProvider>
        <RouterProvider router={router} />
      </SchemaProvider>
    </YDocProvider>
  )
}

export default App;