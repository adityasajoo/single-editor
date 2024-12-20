import { Extension } from '@tiptap/core'

export const DoubleEnterExtension = Extension.create({
    name: 'doubleEnter',

    addKeyboardShortcuts() {
        return {
            'Enter': ({ editor }) => {
                const { state } = editor
                const { selection } = state
                const $pos = selection.$from
                const parentNode = $pos.parent
                const grandParentNode = $pos.node($pos.depth - 1)

                if (
                    parentNode?.type?.name === 'paragraph' &&
                    grandParentNode?.type?.name === 'sceneContent' &&
                    parentNode.textContent.trim() === ''
                ) {
                    editor.commands.insertScene()
                    return true
                }

                return false
            }
        }
    },
})
