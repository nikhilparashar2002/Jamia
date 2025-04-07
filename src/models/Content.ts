import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  slug: string;
  status: string;
  isDeleted: boolean;
  faq: Array<{ question: string; answer: string }>; // Add FAQ interface
  seo: {
    focusKeywords: string[];
    // ...other SEO fields...
  };
  // ...other fields...
}

const versionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  diffs: [{
    operation: {
      type: String,
      enum: ['insert', 'delete', 'equal'],
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  seo: {
    type: Object,
    required: true
  },
  author: {
    email: String,
    firstName: String,
    lastName: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  changelog: {
    type: String,
    required: true
  }
});

const versionComparisonSchema = new mongoose.Schema({
  fromVersion: Number,
  toVersion: Number,
  differences: {
    content: {
      added: [String],
      removed: [String],
      modified: {
        before: String,
        after: String
      }
    },
    seo: {
      titleChanged: Boolean,
      descriptionChanged: Boolean,
      keywordsAdded: [String]
    }
  }
});

const seoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  canonicalUrl: {
    type: String,
  },
  ogTitle: {
    type: String,
    trim: true,
  },
  ogDescription: {
    type: String,
    trim: true,
  },
  ogImage: {
    type: String,
  },
  focusKeywords: [
    {
      type: String,
      trim: true,
    },
  ],
  readabilityScore: Number,
  metaRobots: {
    type: String,
    enum: [
      "index,follow",
      "noindex,follow",
      "index,nofollow",
      "noindex,nofollow",
    ],
    default: "index,follow",
  },
});

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  format: {
    type: String,
  },
  resourceType: {
    type: String,
    enum: ["image", "video", "raw"],
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  caption: String,
  width: Number,
  height: Number,
  size: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    content: {
      type: Object,
      required: true,
    },
    plainText: {
      type: String,
      required: true,
      trim: true,
    },
    wordCount: {
      type: Number,
      min: 0,
    },
    readingTime: {
      type: Number,
      min: 0,
    },
    // Add FAQ field to store structured question-answer pairs
    faq: {
      type: [{
        question: {
          type: String,
          required: true,
          trim: true
        },
        answer: {
          type: String, // This will store HTML content for rich-text answers
          required: true
        }
      }],
      default: [] // Add default empty array to ensure field always exists
    },
    seo: {
      type: seoSchema,
      required: true,
    },
    media: [mediaSchema],
    headerImage: {
      type: mediaSchema,
      required: false
    },
    status: {
      type: String,
      enum: ["draft", "review", "published", "scheduled", "archived"],
      default: "draft",
      index: true // Already indexed in schema definition
    },
    scheduledPublish: Date,
    author: {
      email: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    categories: [String],
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    keywords: [
      {
        type: String,
        trim: true
      }
    ],
    currentVersion: {
      type: Number,
      default: 1
    },
    versions: [versionSchema],
    versionComparison: versionComparisonSchema,
    versioningPolicy: {
      maxVersions: {
        type: Number,
        default: 30
      },
      keepMajorChanges: {
        type: Boolean,
        default: true
      },
      autoPurgeAfter: {
        type: Number,
        default: 90,
        description: "Days after which old versions can be purged"
      }
    },
    seoAnalysis: {
      keywordDensity: Number,
      titleLength: Number,
      descriptionLength: Number,
      contentLength: Number,
      readability: Number,
      hasImages: Boolean,
      hasLinks: Boolean,
      keywordInTitle: Boolean,
      keywordInDescription: Boolean,
      keywordInFirstParagraph: Boolean,
      keywordInHeadings: Boolean,
      hasMetaDescription: Boolean,
      hasFocusKeyword: Boolean,
    },
    tableOfContents: {
      type: [{
        level: Number,
        text: String,
        id: String,
      }],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ plainText: "text" });
contentSchema.index({ categories: 1 });
contentSchema.index({ "author.email": 1 });
contentSchema.index({ title: "text", "seo.focusKeywords": "text" });

export const Content = mongoose.models.Content || mongoose.model<IContent>("Content", contentSchema);
