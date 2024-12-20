/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from '@tiptap/core'

interface SceneOptions {
    HTMLAttributes?: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        scene: {
            insertScene: () => ReturnType
        }
    }
}

export const Scene = Node.create<SceneOptions>({
    name: 'scene',
    group: 'block',
    content: 'sceneHeading sceneContent',
    defining: true,
    draggable: false,

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="scene"]'
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes({ 'data-type': 'scene', class: 'scene' }, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            insertScene:
                () =>
                    ({ commands, editor }) => {
                        const { state } = editor.view
                        const endPos = state.doc.content.size // position at the end of the doc
                        return commands.insertContentAt(endPos, {
                            type: this.name,
                            content: [
                                {
                                    type: 'sceneHeading',
                                    content: [{ type: 'text', text: 'Scene Title' }]
                                },
                                {
                                    type: 'sceneContent',
                                    content: [
                                        {
                                            type: 'paragraph',
                                            // content: [{ type: 'text', text: '' }]
                                        }
                                    ]
                                }
                            ]
                        })
                    },
        }
    }

})
