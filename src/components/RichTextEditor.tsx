import { Lock, LockOpen, TextFields, Link as LinkIcon, Save as SaveIcon } from "@mui/icons-material";
import { 
  Box, Button, Stack, Typography, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Checkbox, FormControlLabel 
} from "@mui/material";
import type { EditorOptions } from "@tiptap/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/core";
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./useExtensions";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
  index: string;
}

const extractHeadings = (editor: Editor): TableOfContentsItem[] => {
  const headings: TableOfContentsItem[] = [];
  const indices: number[] = [0, 0, 0]; // For h2, h3, h4

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      const level = node.attrs.level;
      if (level >= 2 && level <= 4) {
        const levelIndex = level - 2;
        indices[levelIndex]++;
        
        // Reset sub-indices
        for (let i = levelIndex + 1; i < indices.length; i++) {
          indices[i] = 0;
        }

        const index = indices
          .slice(0, levelIndex + 1)
          .filter(i => i > 0)
          .join('.');

        const id = `heading-${pos}`;
        headings.push({
          id,
          level,
          text: node.textContent || '',
          index
        });

      }


    }
  });

  return headings;
};

const cleanHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  const cleanElement = (element: Element) => {
    // Keep only id, href, and src attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'id' && attr.name !== 'href' && attr.name !== 'src') {
        element.removeAttribute(attr.name);
      }
    });
    
    // Keep class names only for specific elements if needed
    if (element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4') {
      if (!element.id) {
        element.id = `heading-${Math.random().toString(36).substr(2, 9)}`;
      }
    }
    
    // Clean child elements recursively
    Array.from(element.children).forEach(cleanElement);
  };
  
  cleanElement(div);
  return div.innerHTML;
};

// Update interface for our link dialog
interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string, follow: boolean, text?: string) => void;
  initialUrl?: string;
  initialFollow?: boolean;
  initialText?: string;
  title: string;
}

// Update the LinkDialog component to handle validation properly
const LinkDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialUrl = '', 
  initialFollow = true,
  initialText = '',
  title
}: LinkDialogProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [follow, setFollow] = useState(initialFollow);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setFollow(initialFollow);
      setText(initialText);
      setError('');
    }
  }, [open, initialUrl, initialFollow, initialText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    
    // If URL is empty or has an invalid format, show error
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    // Add https:// prefix if no protocol is specified
    let finalUrl = url;
    if (!url.match(/^https?:\/\//)) {
      finalUrl = 'https://' + url;
    }
    
    onSubmit(finalUrl, follow, text);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="text"
            fullWidth
            variant="outlined"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(''); // Clear error when user types
            }}
            error={!!error}
            helperText={error || "Enter link URL (e.g., https://example.com)"}
            required
          />
          <TextField
            margin="dense"
            label="Link Text"
            type="text"
            fullWidth
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text to display (leave empty to use URL)"
            className="mt-4"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={follow}
                onChange={(e) => setFollow(e.target.checked)}
              />
            }
            label="Allow Search Engines to Follow this Link (Improves SEO)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Insert</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default function RichTextEditorComponent({ content, onChange }: RichTextEditorProps) {
  const extensions = useExtensions({
    placeholder: "Add your content here...",
  });

  const rteRef = useRef<RichTextEditorRef>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');
  const [currentLinkText, setCurrentLinkText] = useState('');
  const [currentLinkHasFollow, setCurrentLinkHasFollow] = useState(true);
  const [currentContent, setCurrentContent] = useState<string>(content);

  useEffect(() => {
    if (rteRef.current?.editor) {
      const headings = extractHeadings(rteRef.current.editor);
      setTableOfContents(headings);
    }
  }, []);

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    [],
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles],
    );

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (view, event, _slice) => {
        if (!event.clipboardData) {
          return false;
        }

        // Handle image files
        const pastedImageFiles = fileListToImageFiles(event.clipboardData.files);
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          return true;
        }

        // Handle HTML content
        const html = event.clipboardData.getData('text/html');
        if (html) {
          event.preventDefault();
          const cleanedHtml = cleanHtml(html);
          
          if (rteRef.current?.editor) {
            rteRef.current.editor.commands.insertContent(cleanedHtml);
          }
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simple link update function without extra logic
  const handleLinkUpdate = (url: string, follow: boolean, text?: string) => {
    if (!rteRef.current?.editor) return;
    if (!url.trim()) return;

    // Set appropriate rel attributes
    const relAttrs = ['noopener', 'noreferrer'];
    if (!follow) {
      relAttrs.push('nofollow');
    }

    const editor = rteRef.current.editor;
    const { from, to } = editor.state.selection;
    
    // If link text was provided and is different from selection
    if (text && editor.state.doc.textBetween(from, to) !== text) {
      // Delete current selection
      editor.chain().deleteSelection().run();
      
      // Insert text and select it
      editor.chain().insertContent(text).run();
      
      // Get the new positions after text insertion
      const curPos = editor.state.selection.from;
      const newFrom = curPos - text.length;
      
      // Select the newly inserted text
      editor.chain().setTextSelection({ from: newFrom, to: curPos }).run();
    }
    
    // Apply link to selection
    editor.chain().setLink({
      href: url,
      rel: relAttrs.join(' '),
      target: '_blank',
    }).focus().run();
  };

  // Updated to get selected text
  const handleOpenLinkDialog = useCallback(() => {
    if (!rteRef.current?.editor) return;
    
    const editor = rteRef.current.editor;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    
    // Check if cursor is on an existing link
    const linkAttrs = editor.getAttributes('link');
    
    if (linkAttrs.href) {
      setCurrentLinkUrl(linkAttrs.href);
      setCurrentLinkText(selectedText);
      setCurrentLinkHasFollow(!(linkAttrs.rel as string || '').includes('nofollow'));
    } else {
      setCurrentLinkUrl('');
      setCurrentLinkText(selectedText);
      setCurrentLinkHasFollow(true);
    }
    
    setLinkDialogOpen(true);
  }, []);

  // Add a save function
  const handleSave = useCallback(() => {
    if (!rteRef.current?.editor) return;
    
    // First ensure all headings have IDs
    let html = rteRef.current.editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4'));
    
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}-${Math.random().toString(36).substr(2, 9)}`;
      }
    });

    // Get updated HTML with IDs
    html = doc.body.innerHTML;
    
    // Call onChange with the updated HTML
    onChange(html);
  }, [onChange]);

  // Modified renderCustomControls to include save button
  const renderCustomControls = () => {
    return (
      <div className="flex flex-wrap items-center">
        {/* Standard editor controls */}
        <div className="flex-grow">
          <EditorMenuControls />
        </div>
        
        {/* Link button and Save button */}
        <div className="flex space-x-2 border-l pl-3 ml-3">
          <Button
            size="small"
            startIcon={<LinkIcon />}
            variant="contained"
            color="primary"
            onClick={handleOpenLinkDialog}
            sx={{ 
              height: '36px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            Insert Link
          </Button>
          <Button
            size="small"
            startIcon={<SaveIcon />}
            variant="contained"
            color="success"
            onClick={handleSave}
            sx={{ 
              height: '36px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 250px',
        gap: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        "& .ProseMirror": {
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '1rem',
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            scrollMarginTop: showMenuBar ? 50 : 0,
            direction: 'ltr',
            unicodeBidi: 'bidi-override',
            '& > *': {
              direction: 'ltr',
              unicodeBidi: 'embed'
            }
          },
        },
      }}
    >
      <Box>
        <RichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={content}
        editable={isEditable}
        editorProps={{
          handleDrop: handleDrop,
          handlePaste: handlePaste,
        }}
        onUpdate={({ editor }) => {
          // Get HTML and update internal state
          let html = editor.getHTML();
          setCurrentContent(html);
          
          // Update table of contents
          const tocHeadings = extractHeadings(editor);
          setTableOfContents(tocHeadings);
          
          // No onChange call - no autosave
        }}
        renderControls={renderCustomControls}
        RichTextFieldProps={{
          variant: "outlined",
          MenuBarProps: {
            hide: !showMenuBar,
          },
          footer: (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                borderTopStyle: "solid",
                borderTopWidth: 1,
                borderTopColor: (theme) => theme.palette.divider,
                py: 1,
                px: 1.5,
              }}
            >
              <MenuButton
                value="formatting"
                tooltipLabel={
                  showMenuBar ? "Hide formatting" : "Show formatting"
                }
                size="small"
                onClick={() =>
                  setShowMenuBar((currentState) => !currentState)
                }
                selected={showMenuBar}
                IconComponent={TextFields}
              />

              <MenuButton
                value="formatting"
                tooltipLabel={
                  isEditable
                    ? "Prevent edits (use read-only mode)"
                    : "Allow edits"
                }
                size="small"
                onClick={() => setIsEditable((currentState) => !currentState)}
                selected={!isEditable}
                IconComponent={isEditable ? Lock : LockOpen}
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Content
              </Button>
            </Stack>
          ),
        }}
      >
        {() => (
          <>
            {/* Single Link Dialog */}
            <LinkDialog 
              open={linkDialogOpen}
              onClose={() => setLinkDialogOpen(false)}
              onSubmit={handleLinkUpdate}
              initialUrl={currentLinkUrl}
              initialFollow={currentLinkHasFollow}
              initialText={currentLinkText}
              title="Insert Link"
            />
            
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>
    </Box>
      <Box sx={{ p: 2, borderLeft: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>Table of Contents</Typography>
        {tableOfContents.map((heading) => (
          <Box
            key={heading.id}
            sx={{
              pl: (heading.level - 2) * 2,
              mb: 1,
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            onClick={() => handleHeadingClick(heading.id)}
          >
            <Typography variant="body2">
              {heading.index}. {heading.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}
