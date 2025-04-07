'use client';

import React, { useState, useEffect } from 'react';
import { Input, Textarea, Select, SelectItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip } from '@nextui-org/react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface BasicInfoStepProps {
  title: string;
  description: string;
  categories: string[];
  keywords: string[];
  slug: string;
  onUpdate: (field: string, value: any) => void;
}

export default function BasicInfoStep({
  title,
  description,
  categories,
  keywords,
  slug,
  onUpdate
}: BasicInfoStepProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [newKeyword, setNewKeyword] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    slug: '',
    categories: '',
    description: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data.categories);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'title':
        if (!value) return 'Title is required';
        if (value.length < 10) return 'Title must be at least 10 characters long';
        if (value.length > 100) return 'Title must not exceed 100 characters';
        return '';
      case 'slug':
        if (!value) return 'Slug is required';
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Slug must contain only lowercase letters, numbers, and hyphens';
        return '';
      case 'categories':
        if (!value || value.length === 0) return 'At least one category is required';
        return '';
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 50) return 'Description must be at least 50 characters long';
        if (value.length > 300) return 'Description must not exceed 300 characters';
        return '';
      default:
        return '';
    }
  };

  const handleUpdate = (field: string, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    onUpdate(field, value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (!categories.includes(selectedCategory)) {
      const updatedCategories = [...categories, selectedCategory];
      handleUpdate('categories', updatedCategories);
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
    handleUpdate('categories', updatedCategories);
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.slug) {
        setCategoryError('Both name and slug are required');
        return;
      }

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newCategory.slug)) {
        setCategoryError('Slug must contain only lowercase letters, numbers, and hyphens');
        return;
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableCategories(prev => [...prev, data.category]);
        setNewCategory({ name: '', slug: '' });
        setCategoryError('');
        onClose();
      } else {
        const error = await response.json();
        setCategoryError(error.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryError('Failed to add category');
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g., Top 10 SEO Tips for 2024"
        value={title}
        onChange={(e) => handleUpdate('title', e.target.value)}
        isRequired
        isInvalid={!!errors.title}
        errorMessage={errors.title}
      />

      <Input
        label="Slug"
        placeholder="e.g., top-10-seo-tips-2024"
        value={slug}
        onChange={(e) => handleUpdate('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
        isRequired
        isInvalid={!!errors.slug}
        errorMessage={errors.slug}
      />

      <div className="space-y-2">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              label="Categories"
              placeholder="Select categories"
              onChange={handleCategoryChange}
              isRequired
              isInvalid={!!errors.categories}
              errorMessage={errors.categories}
            >
              {availableCategories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </Select>
          </div>
          <Button color="primary" variant="flat" onPress={onOpen}>Add Category</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <Chip
              key={index}
              onClose={() => handleRemoveCategory(cat)}
              variant="flat"
              color="primary"
            >
              {cat}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Input
          label="Keywords"
          placeholder="Type a keyword and press Enter"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const keyword = newKeyword.trim();
              if (keyword && !keywords.includes(keyword)) {
                onUpdate('keywords', [...keywords, keyword]);
                setNewKeyword('');
              }
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Chip
              key={index}
              onClose={() => {
                const updatedKeywords = keywords.filter((_, i) => i !== index);
                onUpdate('keywords', updatedKeywords);
              }}
              variant="flat"
              color="secondary"
            >
              {keyword}
            </Chip>
          ))}
        </div>
      </div>

      <Textarea
        label="Description"
        placeholder="e.g., Discover the most effective SEO strategies for 2024. Learn expert tips to improve your website's search engine rankings and drive organic traffic."
        value={description}
        onChange={(e) => handleUpdate('description', e.target.value)}
        isRequired
        minRows={4}
        isInvalid={!!errors.description}
        errorMessage={errors.description}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Category Name"
                placeholder="e.g., SEO Tips"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                isRequired
              />
              <Input
                label="Category Slug"
                placeholder="e.g., seo-tips"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                isRequired
              />
              {categoryError && <div className="text-danger">{categoryError}</div>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={handleAddCategory}>Add Category</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}