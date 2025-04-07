"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";

interface MediaStepProps {
  headerImage: {
    url?: string;
    data?: string;
    publicId?: string;
    resourceType?: string;
    alt: string; // Make alt required
    caption?: string;
  } | null;
  media: Array<{
    data: string;
    resourceType: string;
    alt: string;
    caption?: string;
  }>;
  onUpdate: (field: string, value: any) => void;
}

interface ErrorState {
  headerImage: string;
  headerImageAlt: string;
  mediaAlt: Record<number, string>;
}

export default function MediaStep({
  headerImage,
  media,
  onUpdate,
}: MediaStepProps) {
  const [errors, setErrors] = useState<ErrorState>({
    headerImage: "",
    headerImageAlt: "",
    mediaAlt: {},
  });

  const validateImage = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed";
    }
    if (file.size > maxSize) {
      return "Image size must not exceed 5MB";
    }
    return "";
  };

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setErrors((prev) => ({ ...prev, headerImage: error }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        if (typeof imageData === "string") {
          onUpdate("headerImage", {
            data: imageData,
            resourceType: "image",
            alt: "", // Initialize with empty string instead of undefined
            caption: undefined,
          });
          setErrors((prev) => ({ ...prev, headerImage: "" }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const error = validateImage(file);
      if (error) {
        alert(`File ${file.name}: ${error}`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target?.result;
        if (typeof fileData === "string") {
          const newMedia = {
            data: fileData,
            publicId: "",
            resourceType: "image",
            alt: "",
            caption: undefined,
          };
          onUpdate("media", [...media, newMedia]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Header Image</h3>
            <div className="space-y-2">
              {headerImage?.url || headerImage?.data ? (
                <div className="space-y-4">
                  <img
                    src={headerImage.url || headerImage.data}
                    alt={headerImage.alt}
                    className="max-w-full h-auto rounded-lg shadow"
                  />
                  <div className="space-y-2">
                    <Input
                      label="Alt Text"
                      value={headerImage.alt}
                      onChange={(e) => {
                        const newHeaderImage = {
                          ...headerImage,
                          alt: e.target.value,
                        };
                        onUpdate("headerImage", newHeaderImage);
                      }}
                      isRequired
                      isInvalid={!!errors.headerImageAlt}
                      errorMessage={errors.headerImageAlt}
                    />
                    <Input
                      label="Caption (optional)"
                      value={headerImage.caption || ""}
                      onChange={(e) => {
                        const newHeaderImage = {
                          ...headerImage,
                          caption: e.target.value,
                        };
                        onUpdate("headerImage", newHeaderImage);
                      }}
                    />
                  </div>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => onUpdate("headerImage", null)}
                  >
                    Remove Header Image
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageUpload}
                    className="hidden"
                    id="header-image-upload"
                  />
                  <label htmlFor="header-image-upload">
                    <Button
                      as="span"
                      color="primary"
                      variant="flat"
                      className="cursor-pointer"
                    >
                      Upload Header Image
                    </Button>
                  </label>
                  {errors.headerImage && (
                    <p className="text-danger text-sm mt-1">
                      {errors.headerImage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={item.data}
                    alt={item.alt}
                    className="w-full h-48 object-cover rounded-lg shadow"
                  />
                  <Input
                    size="sm"
                    label="Alt Text"
                    value={item.alt}
                    onChange={(e) => {
                      const newMedia = [...media];
                      newMedia[index] = { ...item, alt: e.target.value };
                      onUpdate("media", newMedia);
                    }}
                    isRequired
                    isInvalid={!!errors.mediaAlt[index]}
                    errorMessage={errors.mediaAlt[index]}
                  />
                  <Input
                    size="sm"
                    label="Caption (optional)"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const newMedia = [...media];
                      newMedia[index] = { ...item, caption: e.target.value };
                      onUpdate("media", newMedia);
                    }}
                  />
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      const newMedia = media.filter((_, i) => i !== index);
                      onUpdate("media", newMedia);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload">
                  <Button
                    as="span"
                    color="primary"
                    variant="flat"
                    className="cursor-pointer"
                  >
                    Add Media
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
