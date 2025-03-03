import ExampleTheme from "../themes/ExampleTheme.js";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "../plugins/ToolbarPlugin.js";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import ActionsPlugin from "../plugins/ActionsPlugin.js";
import CodeHighlightPlugin from "../plugins/CodeHighlightPlugin.js";
// import prepopulatedText from "../SampleText.js";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import ImagePlugin from "../plugins/plugins/ImagePlugin.js";
import { ImageNode } from "../plugins/nodes/ImageNode.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useMemo } from 'react';


function Placeholder() {
    return (
        <div className="editor-placeholder">
            在这里写下你的文章吧...
        </div>
    );
}


function MyCustomAutdfoFocusPlugin() {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        editor.focus();
        const state = editor.getEditorState();
        console.log('-----', editor.parseEditorState(state.toJSON()));
    }, [editor]);
    return null;
}


function InitialPlugin(editContent: any) {
    const [editor] = useLexicalComposerContext();
    const memoizedEditContent = useMemo(() => editContent, [JSON.stringify(editContent)]);

    useEffect(() => {
        if (memoizedEditContent.editContent.length) {
            try {
                editor.update(() => {
                    const editorState = editor.parseEditorState(memoizedEditContent.editContent);
                    editor.setEditorState(editorState);
                });
            } catch (error) {
                console.error('Failed to parse editContent:', error);
            }
        }
    }, [memoizedEditContent, editor]);
    return null
}

const editorConfig = {
    // editorState: prepopulatedText, // 样例
    theme: ExampleTheme,
    onError(error: any) {
        throw error;
    },
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

const Editor = forwardRef(({ editContent }: any, ref) => {

    return (
        <LexicalComposer initialConfig={editorConfig as any}>
            <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />} ErrorBoundary={LexicalErrorBoundary} />
                    <AutoFocusPlugin />
                    <ActionsPlugin />

                    <ListPlugin />
                    <LinkPlugin />
                    <HistoryPlugin></HistoryPlugin>
                    {/* <OnChangePlugin onChange={(editorState) => onChange(editorState, onContentChange)} /> */}
                    <MyCustomAutdfoFocusPlugin />
                    <InitialPlugin editContent={editContent}></InitialPlugin>
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <CodeHighlightPlugin />
                    <EditorRefHandler ref={ref} />
                    <ImagePlugin></ImagePlugin>
                </div>
                {/* <GetEditState getEditState={() => onContentChange}></GetEditState> */}

            </div>
        </LexicalComposer>
    );
})
export default Editor;