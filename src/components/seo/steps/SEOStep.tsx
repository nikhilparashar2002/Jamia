'use client';

import React, { useState } from 'react';
import { Input, Textarea, Chip } from '@nextui-org/react';

interface SEOStepProps {
  seoTitle: string;
  seoDescription: string;
  focusKeywords: string[];
  metaRobots: string;
  onUpdate: (field: string, value: any) => void;
}

export default function SEOStep({
  seoTitle,
  seoDescription,
  focusKeywords,
  metaRobots,
  onUpdate
}: SEOStepProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [errors, setErrors] = useState({
    seoTitle: '',
    seoDescription: '',
    metaRobots: ''
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'seoTitle':
        if (!value) return 'SEO Title is required';
        if (value.length < 30) return 'SEO Title should be at least 30 characters';
        if (value.length > 60) return 'SEO Title should not exceed 60 characters';
        return '';
      case 'seoDescription':
        if (!value) return 'SEO Description is required';
        if (value.length < 120) return 'SEO Description should be at least 120 characters';
        if (value.length > 160) return 'SEO Description should not exceed 160 characters';
        return '';
      case 'metaRobots':
        if (!value) return 'Meta Robots is required';
        if (!/^(index|noindex),(follow|nofollow)$/.test(value)) {
          return 'Meta Robots should be in format: index,follow or noindex,nofollow';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldUpdate = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    // Map the field names to match the parent component's state structure
    const fieldMapping: { [key: string]: string } = {
      seoTitle: 'title',
      seoDescription: 'description',
      metaRobots: 'metaRobots',
      focusKeywords: 'focusKeywords'
    };
    onUpdate(fieldMapping[field] || field, value);
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newKeyword.trim()) {
      e.preventDefault();
      const trimmedKeyword = newKeyword.trim();
      if (!focusKeywords.includes(trimmedKeyword)) {
        const updatedKeywords = [...focusKeywords, trimmedKeyword];
        onUpdate('focusKeywords', updatedKeywords);
      }
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = focusKeywords.filter((_, i) => i !== index);
    onUpdate('focusKeywords', updatedKeywords);
  };

  return (
    <div className="space-y-4">
      <Input
        label="SEO Title"
        placeholder="e.g., Best SEO Tips and Strategies for 2024 | Complete Guide"
        value={seoTitle}
        onChange={(e) => handleFieldUpdate('seoTitle', e.target.value)}
        isRequired
        isInvalid={!!errors.seoTitle}
        errorMessage={errors.seoTitle}
      />

      <Textarea
        label="SEO Description"
        placeholder="e.g., Master the latest SEO techniques with our comprehensive guide to the top 10 SEO strategies for 2024. Learn proven methods to boost your website rankings and increase organic traffic."
        value={seoDescription}
        onChange={(e) => handleFieldUpdate('seoDescription', e.target.value)}
        isRequired
        minRows={4}
        isInvalid={!!errors.seoDescription}
        errorMessage={errors.seoDescription}
      />

      <div>
        <Input
          label="Focus Keywords"
          placeholder="e.g., seo tips 2024, search engine optimization, website ranking (Press Enter to add)"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={handleAddKeyword}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {focusKeywords.map((keyword, index) => (
            <Chip
              key={`${keyword}-${index}`}
              onClose={() => handleRemoveKeyword(index)}
              variant="flat"
            >
              {keyword}
            </Chip>
          ))}
        </div>
      </div>

      <Input
        label="Meta Robots"
        placeholder="e.g., index,follow (default) or noindex,nofollow"
        value={metaRobots}
        onChange={(e) => handleFieldUpdate('metaRobots', e.target.value)}
        isRequired
        isInvalid={!!errors.metaRobots}
        errorMessage={errors.metaRobots}
      />
    </div>
  );
}