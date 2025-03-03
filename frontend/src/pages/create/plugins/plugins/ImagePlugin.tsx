import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
    $createParagraphNode,
    $getSelection,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand
} from "lexical";
import { useEffect } from "react";

import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand(
    "INSERT_IMAGE_COMMAND"
);

export default function ImagesPlugin({
    captionsEnabled
}: {
    captionsEnabled?: boolean;
}): JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error("ImagesPlugin: ImageNode not registered on editor");
        }

        return mergeRegister(
            editor.registerCommand<InsertImagePayload>(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    const imageNode = $createImageNode(payload);
                    console.log('----imageNode-----', imageNode);

                    const selection = $getSelection();
                    console.log('selection:', selection);

                    if (selection) {
                        $insertNodes([imageNode]);
                        const imageParent = imageNode.getParent();
                        if (imageParent && $isRootOrShadowRoot(imageParent)) {
                            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                        } else if (!imageParent) {
                            console.error('Image node has no parent after insertion.');
                            return false;
                        }
                    } else {
                        console.error('No selection found.');
                        return false;
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            )
        );
    }, [captionsEnabled, editor]);

    return null;
}
