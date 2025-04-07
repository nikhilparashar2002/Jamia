import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';

interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
  index: string;
}

interface ContentPreviewProps {
  title: string;
  metaDescription?: string;
  keywords?: string;
  category?: string[];
  content: string;
  description?: string;
  headerImage?: {
    data: string;
    alt: string;
    caption?: string;
  } | null;
}

const extractHeadings = (content: string): TableOfContentsItem[] => {
  const tempEditor = new Editor({
    extensions: [StarterKit],
    content,
  });

  const headings: TableOfContentsItem[] = [];
  const indices: number[] = [0, 0, 0]; // For h2, h3, h4

  tempEditor.state.doc.descendants((node, pos) => {
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
          text: node.textContent,
          index
        });
      }
    }
  });

  tempEditor.destroy();
  return headings;
};

const ContentPreview: React.FC<ContentPreviewProps> = ({
  title,
  metaDescription,
  keywords,
  category,
  content,
  description,
  headerImage,
}) => {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    const headings = extractHeadings(content);
    setTableOfContents(headings);
    
  }, [content]);

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const scrollContainer = document.querySelector('.preview-scroll-container');
      if (scrollContainer) {
        const elementPosition = element.offsetTop;
        scrollContainer.scrollTo({
          top: elementPosition - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  const processedContent = content.replace(
    /<h([2-4])(.*?)>/g,
    (match, level, attributes) => {
      const pos = content.indexOf(match);
      const id = `heading-${pos}`;
      return `<h${level}${attributes || ''} id="${id}" class="scroll-mt-20">`;
    }
  );

  return (
    <Card className="w-full h-full bg-white shadow-lg">
      <CardBody className="p-6 h-[calc(100vh-200px)] overflow-hidden">
        <div className="grid grid-cols-[1fr_250px] gap-4">
          <ScrollArea className="h-[calc(100vh-250px)] w-full preview-scroll-container" type="always">
            <div className="space-y-6">
              <div>
                {headerImage && (
                  <div className="mb-6">
                    <img
                      src={headerImage.data}
                      alt={headerImage.alt}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    {headerImage.caption && (
                      <p className="mt-2 text-sm text-gray-500 text-center">{headerImage.caption}</p>
                    )}
                  </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {category && category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.map((cat, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {description && (
                <div className="mt-4 text-gray-700">
                  <p>{description}</p>
                </div>
              )}

              <div className="prose prose-sm max-w-none mt-8">
                <div className="[&_h2,&_h3,&_h4]:scroll-mt-8" dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>
            </div>
          </ScrollArea>
          <div className="border-l border-gray-200 pl-4">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <ScrollArea className="h-[calc(100vh-350px)]" type="always">
              {tableOfContents.map((heading) => (
                <div
                  key={heading.id}
                  className="pl-[calc(theme(spacing.2)*var(--level))] mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                  style={{ '--level': heading.level - 2 } as React.CSSProperties}
                  onClick={() => handleHeadingClick(heading.id)}
                >
                  <span className="text-sm">
                    {heading.index}. {heading.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ContentPreview;