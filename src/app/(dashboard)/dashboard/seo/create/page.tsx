"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@nextui-org/react";
import BasicInfoStep from "@/components/seo/steps/BasicInfoStep";
import SEOStep from "@/components/seo/steps/SEOStep";
import MediaStep from "@/components/seo/steps/MediaStep";
import RichTextEditor from "@/components/RichTextEditor";
import PreviewDialog from "@/components/seo/PreviewDialog";

interface FormData {
  title: string;
  description: string;
  categories: string[];
  keywords: string[];
  slug: string;
  content: string;
  tableOfContents: Array<{
    id: string;
    level: number;
    text: string;
    children: never[];
  }>;
  headerImage: {
    url?: string;
    alt: string;
    caption?: string;
    data?: string;
    resourceType?: string;
  } | null;
  media: Array<{
    data: string;
    resourceType: string;
    alt: string;
    caption?: string;
  }>;
  seo: {
    title: string;
    description: string;
    focusKeywords: string[];
    metaRobots: string;
  };
}

export default function CreateContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    categories: [],
    keywords: [],
    slug: "",
    content: "",
    headerImage: null,
    media: [],
    tableOfContents: [],
    seo: {
      title: "",
      description: "",
      focusKeywords: [],
      metaRobots: "index,follow",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  const handleSubmit = async () => {
    if (!session) {
      alert("You must be logged in to create content");
      return;
    }

    console.log("Form Data:", {
      title: formData.title,
      description: formData.description,
      categories: formData.categories,
      keywords: formData.keywords,
      slug: formData.slug,
      content: formData.content,
      headerImage: formData.headerImage,
      media: formData.media,
      tableOfContents: formData.tableOfContents,
      seo: formData.seo,
    });

    setIsSubmitting(true);
    try {
      // Log form data before making any API calls
      console.log("Starting content submission...");
      console.log("Form validation status:", {
        basicInfo: Boolean(
          formData.title &&
            formData.description &&
            formData.categories.length > 0 &&
            formData.slug
        ),
        seoSettings: Boolean(formData.seo.title && formData.seo.description),
        content: formData.content.length > 0,
      });

      // Log header image data if exists
      console.log(
        "Header image status:",
        formData.headerImage ? "Present" : "Not provided"
      );
      if (formData.headerImage) {
        console.log("Header image details:", {
          type: formData.headerImage.resourceType,
          hasAlt: Boolean(formData.headerImage.alt),
          hasCaption: Boolean(formData.headerImage.caption),
        });
      }

      // Log media files information
      console.log("Media files to upload:", formData.media.length);
      formData.media.forEach((media, index) => {
        console.log(`Media file ${index + 1}:`, {
          type: media.resourceType,
          hasAlt: Boolean(media.alt),
          hasCaption: Boolean(media.caption),
        });
      });

      // Upload header image to Cloudinary if exists
      let headerImageData = null;
      if (formData.headerImage) {
        const uploadResponse = await fetch("/api/upload/cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: formData.headerImage.data,
            options: {
              folder: "seo-content/headers",
              resource_type: formData.headerImage.resourceType,
            },
          }),
        });
        if (!uploadResponse.ok)
          throw new Error("Failed to upload header image");
        const a = await uploadResponse.json();
        headerImageData = {
          ...a,
          resourceType: formData.headerImage.resourceType,
          alt: formData.headerImage.alt || "",
          caption: formData.headerImage.caption,
        };
      }

      // Upload media files to Cloudinary
      const mediaUploads = await Promise.all(
        formData.media.map(async (media) => {
          const uploadResponse = await fetch("/api/upload/cloudinary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: media.data,
              options: {
                folder: "seo-content/media",
                resource_type: media.resourceType,
              },
            }),
          });
          if (!uploadResponse.ok) throw new Error("Failed to upload media");
          const mediaData = await uploadResponse.json();
          return {
            ...mediaData,
            alt: media.alt,
            caption: media.caption,
          };
        })
      );

      // Create content directly in MongoDB
      const response = await fetch("/api/seo/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title: formData.title,
            description: formData.description,
            slug: formData.slug,
            categories: formData.categories,
            keywords: formData.keywords,
            content: formData.content,
            headerImage: headerImageData,
            media: mediaUploads,
            tableOfContents: formData.tableOfContents,
            seo: formData.seo,
            status: "draft",
            author: {
              email: session.user.email,
              firstName:
                session.user.firstName ||
                session.user.name?.split(" ")[0] ||
                "Unknown",
              lastName:
                session.user.lastName ||
                session.user.name?.split(" ")[1] ||
                "User",
            },
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      router.push("/dashboard/seo");
    } catch (error) {
      console.error("Error creating content:", error);
      alert("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Content</h1>
        <Button
          color="secondary"
          variant="flat"
          onPress={() => setIsPreviewOpen(true)}
        >
          Preview
        </Button>
      </div>

      {/* Single form instead of StepWizard */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Basic Info Step */}
        <BasicInfoStep
          title={formData.title}
          description={formData.description}
          categories={formData.categories}
          keywords={formData.keywords}
          slug={formData.slug}
          onUpdate={handleUpdateField}
        />

        {/* SEO Settings Step */}
        <SEOStep
          seoTitle={formData.seo.title}
          seoDescription={formData.seo.description}
          focusKeywords={formData.seo.focusKeywords}
          metaRobots={formData.seo.metaRobots}
          onUpdate={(field, value) => {
            setFormData((prev) => ({
              ...prev,
              seo: {
                ...prev.seo,
                [field]: field === "focusKeywords" ? [...value] : value,
              },
            }));
          }}
        />

        {/* Media Step */}
        <MediaStep
          headerImage={formData.headerImage}
          media={formData.media}
          onUpdate={handleUpdateField}
        />

        {/* Content Editor Step */}
        <div className="space-y-4">
          <RichTextEditor
            content={formData.content}
            onChange={(html: string) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const headings = Array.from(
                doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
              );

              const toc = headings.map((heading, index) => {
                if (!heading.id) {
                  heading.id = `heading-${index}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`;
                }
                return {
                  level: parseInt(heading.tagName[1]),
                  text: heading.textContent || "",
                  id: heading.id,
                  children: [] as never[],
                };
              });

              // Re-serialize the modified HTML so headings have proper id attributes
              const updatedHtml = doc.body.innerHTML;
              console.log("Generated Table of Contents:", toc);

              setFormData((prev) => ({
                ...prev,
                content: updatedHtml,
                tableOfContents: toc,
              }));
            }}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            color="default"
            onPress={() => router.push("/dashboard/seo")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>

      {/* Preview Dialog */}
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formData.title}
        metaDescription={formData.seo.description}
        keywords={formData.keywords.join(", ")}
        category={formData.categories}
        content={formData.content}
        description={formData.description}
        headerImage={formData.headerImage}
      />
    </div>
  );
}
