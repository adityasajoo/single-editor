// editor/components/SceneList.tsx
import React from 'react'
import { Link } from 'react-router-dom'

interface SceneListProps {
  headings: string[]
}

export const SceneList: React.FC<SceneListProps> = ({ headings }) => {
  return (
    <nav className="scene-list">
      <h3>Scenes</h3>
      <ol>
        {headings.map((heading, index) => (
          <li key={index}>
            <Link to={`/scene/${index}`}>{heading}</Link>
          </li>
        ))}
      </ol>
      <style>{`
        .scene-list {
          border-right: 1px solid #ccc;
          padding: 1em;
          min-width: 200px;
        }
        .scene-list h3 {
          margin-top: 0;
        }
      `}</style>
    </nav>
  )
}
