'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  Selection,
} from "@nextui-org/react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { PaginationItemRenderProps as NextUIPaginationItemProps } from "@nextui-org/react"; // Add this import

// Extend the NextUI PaginationItemRenderProps type
interface ExtendedPaginationItemProps extends Omit<NextUIPaginationItemProps, 'className'> {
  className?: string;
}

interface SEOContent {
  _id: string;
  title: string;
  focusKeywords: string[];
  status: 'draft' | 'published' | 'review';
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  score: number;
  seo?: {
    title: string;
    description: string;
    focusKeywords: string[];
    metaRobots?: string;
  };
}

interface PaginationItem {
  value: number;
  label: string | number;
  onClick?: () => void;
}

export default function SEOContentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [contents, setContents] = useState<SEOContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContents, setTotalContents] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageLoading, setPageLoading] = useState(false); // Add new state for page transitions

  const rowsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
  ];

  // Fetch SEO contents
  useEffect(() => {
    const fetchContents = async () => {
      setPageLoading(true); // Start loading state
      try {
        const params = new URLSearchParams({
          page: String(currentPage + 1),
          limit: String(rowsPerPage),
          search: searchQuery,
          status: statusFilter !== 'all' ? statusFilter : '',
          sortField: sortField,
          sortOrder: sortOrder
        });

        const response = await fetch(`/api/seo/content?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch content');
        }

        if (!data.contents || !Array.isArray(data.contents)) {
          throw new Error('Invalid data format received from server');
        }

        setContents(data.contents);
        setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
        setTotalContents(data.pagination.total);
      } catch (error) {
        console.error('Error fetching contents:', error);
        setContents([]);
        setTotalPages(1);
        setTotalContents(0);
        alert('Failed to load content. Please try again later.');
      } finally {
        setPageLoading(false);
        setLoading(false);
      }
    };

    fetchContents();
  }, [currentPage, rowsPerPage, searchQuery, statusFilter, sortField, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page - 1);
  };

  // Update the row change handler
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    console.log('Changing rows per page to:', newValue);
    setRowsPerPage(newValue);
    setCurrentPage(0); // Reset to first page
  };

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'review':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderSortArrow = (field: string) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/seo/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SEO Content Management</h1>
        <Button 
          color="primary" 
          onPress={() => router.push('/dashboard/seo/create')}
        >
          Create New Content
        </Button>
      </div>

      <Card>
        <CardHeader className="flex gap-4">
          <div className="flex flex-1 gap-4">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by title, focus keyphrases, or author..."
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Status filter"
                onAction={(key) => handleStatusFilter(key as string)}
              >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="draft">Draft</DropdownItem>
                <DropdownItem key="review">Review</DropdownItem>
                <DropdownItem key="published">Published</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mb-4 text-right">
            <span className="text-sm text-gray-600">Total Contents: {totalContents}</span>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="SEO content table">
            <TableHeader>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('title')}>
                SEO TITLE {renderSortArrow('title')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('seo.focusKeywords')}>
                FOCUS KEYPHRASES {renderSortArrow('seo.focusKeywords')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('author.firstName')}>
                AUTHOR {renderSortArrow('author.firstName')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('status')}>
                STATUS {renderSortArrow('status')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('score')}>
                SEO SCORE {renderSortArrow('score')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('updatedAt')}>
                LAST UPDATED {renderSortArrow('updatedAt')}
              </TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                  <TableCell><Spinner size="sm" /></TableCell>
                </TableRow>
              ) : contents.length === 0 ? (
                <TableRow>
                  <TableCell>No content found</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                contents.map((content) => (
                  <TableRow key={content._id}>
                    <TableCell>{content.title || content.seo?.title || 'Untitled'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(content.focusKeywords || content.seo?.focusKeywords || []).map((keyword, index) => (
                          <Chip key={index} size="sm" variant="flat">
                            {keyword}
                          </Chip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{`${content.author.firstName} ${content.author.lastName}`}</TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(content.status)}
                        variant="flat"
                        size="sm"
                      >
                        {content.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={content.score >= 80 ? "success" : content.score >= 60 ? "warning" : "danger"}
                        variant="flat"
                        size="sm"
                      >
                        {content.score}%
                      </Chip>
                    </TableCell>
                    <TableCell>{formatDate(content.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onPress={() => handleEdit(content._id)}
                        >
                          Edit
                        </Button>
                        {session?.user?.role === 'admin' && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={async () => {
                              try {
                                const response = await fetch(`/api/seo/content/${content._id}/soft-delete`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ isDeleted: true })
                                });
                                
                                if (response.ok) {
                                  setContents(prev => prev.filter(item => item._id !== content._id));
                                } else {
                                  const error = await response.json();
                                  alert(error.message || 'Failed to delete content');
                                }
                              } catch (error) {
                                console.error('Error deleting content:', error);
                                alert('An error occurred while deleting the content');
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!loading && contents.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  className="border rounded px-2 py-1"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
              <Pagination
                isCompact
                showControls
                total={totalPages}
                page={currentPage + 1}
                onChange={handleChangePage}
                variant="bordered"
                size="sm"
                radius="sm"
                classNames={{
                  wrapper: "gap-0.5",
                  item: "w-8 h-8 text-sm",
                  cursor: "bg-primary text-white font-medium",
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}