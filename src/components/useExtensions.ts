import type { EditorOptions } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { FontFamily } from "@tiptap/extension-font-family";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Highlight } from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { useMemo } from "react";
import {
  FontSize,
  HeadingWithAnchor,
  LinkBubbleMenuHandler,
  ResizableImage,
  TableImproved,
} from "mui-tiptap";

export type UseExtensionsOptions = {
  placeholder?: string;
};

// Custom Link extension that completely disables autolink functionality
const CustomLinkExtension = Link.extend({
  inclusive: false,
  addOptions() {
    return {
      ...this.parent?.(),
      // Disable autolink completely - prevents b.tech from becoming a link
      autolink: false,
      // Disable linkOnPaste to prevent URLs in pasted text from becoming links
      linkOnPaste: false,
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      },
    };
  },
});

// Make subscript and superscript mutually exclusive
const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

/**
 * A hook for providing a default set of useful extensions for the MUI-Tiptap
 * editor.
 */
export default function useExtensions({
  placeholder,
}: UseExtensionsOptions = {}): EditorOptions["extensions"] {
  return useMemo(() => {
    return [
      // Note that the Table extension must come before other nodes that also have "tab"
      // shortcut keys so that when using the tab key within a table on a node that also
      // responds to that shortcut, it respects that inner node with higher precedence
      // than the Table. For instance, if you want to indent or dedent a list item
      // inside a table, you should be able to do that by pressing tab. Tab should only
      // move between table cells if not within such a nested node.
      TableImproved.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      BulletList,
      CodeBlock,
      Document,
      HardBreak,
      ListItem,
      OrderedList,
      Paragraph,
      CustomSubscript,
      CustomSuperscript,
      // Configure Text to preserve whitespace and prevent any possible transformations
      Text.configure({
        preserveWhitespace: true
      }),
      Bold,
      Blockquote,

      Code,
      Italic,
      Underline,
      Strike,
      
      // Use our modified Link extension with autolink disabled
      CustomLinkExtension.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
      }),
      
      LinkBubbleMenuHandler,

      // Extensions
      Gapcursor,
      HeadingWithAnchor,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,

      ResizableImage.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: 'resizable-image'
        }
      }),
      // When images are dragged, we want to show the "drop cursor" for where they'll
      // land
      Dropcursor,

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      Placeholder.configure({
        placeholder,
      }),

      History,
    ];
  }, [placeholder]);
}