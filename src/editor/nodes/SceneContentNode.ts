import { Node, mergeAttributes } from '@tiptap/core'

export const SceneContent = Node.create({
  name: 'sceneContent',
  content: 'block+',
  group: 'block',
  draggable: false,

  parseHTML() {
    return [{ tag: 'div[data-type="scene-content"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-type': 'scene-content', class: 'scene-content' }, HTMLAttributes), 0]
  },
})
