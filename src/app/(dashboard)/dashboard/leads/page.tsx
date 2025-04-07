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
} from "@nextui-org/react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  educationMode: string;
  status: string;
  createdAt: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContents, setTotalContents] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [pageLoading, setPageLoading] = useState(false);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      setPageLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage + 1),
          limit: String(rowsPerPage),
          search: searchQuery,
          status: statusFilter !== 'all' ? statusFilter : '',
          sortField: sortField,
          sortOrder: sortOrder
        });

        const response = await fetch(`/api/form?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch leads');
        }

        if (!data.leads || !Array.isArray(data.leads)) {
          throw new Error('Invalid data format received from server');
        }

        setLeads(data.leads);
        setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit));
        setTotalContents(data.pagination.total);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]);
        setTotalPages(1);
        setTotalContents(0);
        alert('Failed to load leads. Please try again later.');
      } finally {
        setPageLoading(false);
        setLoading(false);
      }
    };

    fetchLeads();
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

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setRowsPerPage(newValue);
    setCurrentPage(0);
  };

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'contacted':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads Management</h1>
      </div>

      <Card>
        <CardHeader className="flex gap-4">
          <div className="flex flex-1 gap-4">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by name, email, or phone..."
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
                <DropdownItem key="pending">Pending</DropdownItem>
                <DropdownItem key="contacted">Contacted</DropdownItem>
                <DropdownItem key="completed">Completed</DropdownItem>
                <DropdownItem key="cancelled">Cancelled</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mb-4 text-right">
            <span className="text-sm text-gray-600">Total Leads: {totalContents}</span>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="Leads table">
            <TableHeader>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('name')}>
                NAME {renderSortArrow('name')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('email')}>
                EMAIL {renderSortArrow('email')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('phone')}>
                PHONE {renderSortArrow('phone')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('course')}>
                COURSE {renderSortArrow('course')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('state')}>
                Education Mode {renderSortArrow('state')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('status')}>
                STATUS {renderSortArrow('status')}
              </TableColumn>
              <TableColumn className="cursor-pointer hover:bg-default-100" onClick={() => handleSort('createdAt')}>
                CREATED AT {renderSortArrow('createdAt')}
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
                  <TableCell><Spinner size="sm" /></TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell>No leads found</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.course}</TableCell>
                    <TableCell>{lead.educationMode}</TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(lead.status)}
                        variant="flat"
                        size="sm"
                      >
                        {lead.status}
                      </Chip>
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {session?.user?.role === 'admin' && (
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={async () => {
                              try {
                                const response = await fetch(`/api/form/${lead._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json'
                                  }
                                });
                                
                                if (response.ok) {
                                  setLeads(prev => prev.filter(item => item._id !== lead._id));
                                } else {
                                  const error = await response.json();
                                  alert(error.message || 'Failed to delete lead');
                                }
                              } catch (error) {
                                console.error('Error deleting lead:', error);
                                alert('An error occurred while deleting the lead');
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
          {!loading && leads.length > 0 && (
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