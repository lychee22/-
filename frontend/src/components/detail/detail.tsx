import ExampleTheme from "../../pages/create/themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { ImageNode } from "../../pages/create/plugins/nodes/ImageNode";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

function Placeholder() {
    return (
        <div className="editor-placeholder">
        </div>
    );
}

function InitialPlugin(editContent: any) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (editContent.editContent.length) {
            try {
                editor.update(() => {
                    const editorState = editor.parseEditorState(editContent.editContent);
                    editor.setEditorState(editorState);
                    editor
                });
            } catch (error) {
                console.error('Failed to parse editContent:', error);
            }
        }
    }, [editContent, editor]);
    return null;
}

const editorConfig = {
    theme: ExampleTheme,
    onError(error: any) {
        throw error;
    },
    editable: false,
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        ImageNode
    ]
};

function getEditor(editor: any) {
    const currentState = editor.getEditorState();
    const serializedState = currentState.toJSON();
    return JSON.stringify(serializedState);
}

// 提取一个函数组件来使用 Hook
const EditorRefHandler = forwardRef((_, ref) => {
    const [editor] = useLexicalComposerContext();
    useImperativeHandle(ref, () => ({
        getEditorState: () => {
            const state = getEditor(editor);
            return state;
        }
    }));
    return null;
});

const DetailEditor = forwardRef(({ editContent }: any, ref) => {
    return (
        <LexicalComposer initialConfig={editorConfig as any}>
            <div className="editor-container">
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" readOnly />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <InitialPlugin editContent={editContent} />
                    <EditorRefHandler ref={ref} />
                </div>
            </div>
        </LexicalComposer>
    );
});

export default DetailEditor;