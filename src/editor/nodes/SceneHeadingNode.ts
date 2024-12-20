import { Node, mergeAttributes } from '@tiptap/core'

export const SceneHeading = Node.create({
  name: 'sceneHeading',
  content: 'text*',
  group: 'block',
  draggable: false,

  parseHTML() {
    return [{ tag: 'h2[data-type="scene-heading"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['h2', mergeAttributes({ 'data-type': 'scene-heading', class: 'scene-heading' }, HTMLAttributes), 0]
  },
})
