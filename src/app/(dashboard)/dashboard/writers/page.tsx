'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
} from "@nextui-org/react";

interface Writer {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastLogin: string | null;
  role: string;
  permit: 'Allowed' | 'Restricted';
  description?: string;
  designation?: string;
  profileImage?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

type StatusFilter = 'all' | 'active' | 'not-active' | 'not-logged-in';

export default function WritersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [newWriter, setNewWriter] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    description: '',
    designation: '',
    profileImage: '',
    socials: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: ''
    }
  });
  const [sortField, setSortField] = useState<'name' | 'permit'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editWriter, setEditWriter] = useState<Writer | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    description: '',
    designation: '',
    profileImage: '',
    socials: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: ''
    }
  });
  
  // Fetch writers
  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const response = await fetch(`/api/writers?sortField=${sortField}&sortOrder=${sortOrder}`);
        if (response.ok) {
          const data = await response.json();
          // Log the received data to verify all fields are present
          console.log("Fetched writers data:", data);
          setWriters(data);
        } else {
          console.error('Failed to fetch writers');
        }
      } catch (error) {
        console.error('Error fetching writers:', error);
      } finally {
        setLoading(false);
      }
    };
  // Fetch every minute to keep status updated
    fetchWriters();
    const interval = setInterval(fetchWriters, 60000);
    return () => clearInterval(interval);
  }, [sortField, sortOrder]);

  // Redirect if not admin
  if (session?.user?.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  const handleAddWriter = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newWriter, role: 'writer' }),
      });

      if (response.ok) {
        onClose();
        // Refresh the writers list by refetching
        const writersResponse = await fetch('/api/writers');
        if (writersResponse.ok) {
          const data = await writersResponse.json();
          setWriters(data);
        }
        // Reset form
        setNewWriter({
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          description: '',
          designation: '',
          profileImage: '',
          socials: {
            twitter: '',
            linkedin: '',
            facebook: '',
            instagram: ''
          }
        });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add writer');
      }
    } catch (error) {
      alert('An error occurred while adding the writer');
    }
  };

  const handleEditClick = (writer: Writer) => {
    console.log("Editing writer:", writer); // Debug log
    
    // Initialize the edit form with existing data, using empty strings as fallbacks
    setEditForm({
      firstName: writer.firstName || '',
      lastName: writer.lastName || '',
      email: writer.email || '',
      description: writer.description || '',
      designation: writer.designation || '',
      profileImage: writer.profileImage || '',
      socials: {
        twitter: writer.socials?.twitter || '',
        linkedin: writer.socials?.linkedin || '',
        facebook: writer.socials?.facebook || '',
        instagram: writer.socials?.instagram || ''
      }
    });
    
    setEditWriter(writer);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editWriter) return;
    
    try {
      const response = await fetch(`/api/writers/${editWriter._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        // Update writers list
        const updatedWriters = writers.map(w => 
          w._id === editWriter._id ? { ...w, ...editForm } : w
        );
        setWriters(updatedWriters);
        setIsEditModalOpen(false);
      } else {
        alert('Failed to update writer');
      }
    } catch (error) {
      console.error('Error updating writer:', error);
      alert('An error occurred while updating the writer');
    }
  };

  const getWriterStatus = (lastLogin: string | null): 'active' | 'not-active' | 'not-logged-in' => {
    if (!lastLogin) return 'not-logged-in';
    
    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const nineHoursAgo = new Date(now.getTime() - (9 * 60 * 60 * 1000));
    
    return lastLoginDate >= nineHoursAgo ? 'active' : 'not-active';
  };

  const getStatusColor = (status: 'active' | 'not-active' | 'not-logged-in') => {
    switch (status) {
      case 'active':
        return 'success';
      case 'not-active':
        return 'warning';
      case 'not-logged-in':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: 'active' | 'not-active' | 'not-logged-in') => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'not-active':
        return 'Not Active';
      case 'not-logged-in':
        return 'Not Logged In';
      default:
        return status;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    const loginDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (loginDate >= today) {
      return loginDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return loginDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredWriters = writers.filter(writer => {
    if (statusFilter === 'all') return true;
    const status = getWriterStatus(writer.lastLogin);
    return status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Writers Management</h1>
        <Button color="primary" onPress={onOpen}>
          Add Writer
        </Button>
      </div>

      <Card>
        <CardHeader className="flex gap-4">
          <div className="flex flex-1 gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">
                  Status: {statusFilter === 'all' ? 'All' : getStatusLabel(statusFilter)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Status filter"
                onAction={(key) => setStatusFilter(key as StatusFilter)}
              >
                <DropdownItem key="all">All Writers</DropdownItem>
                <DropdownItem key="active">Active Today</DropdownItem>
                <DropdownItem key="not-active">Not Active</DropdownItem>
                <DropdownItem key="not-logged-in">Not Logged In</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody>
          <Table aria-label="Writers table">
            <TableHeader>
              <TableColumn 
                onClick={() => {
                  if (sortField === 'name') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('name');
                    setSortOrder('asc');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                NAME {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn 
                onClick={() => {
                  if (sortField === 'permit') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('permit');
                    setSortOrder('asc');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                PERMIT {sortField === 'permit' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableColumn>
              <TableColumn>LAST LOGIN</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>Loading writers...</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : filteredWriters.length === 0 ? (
                <TableRow>
                  <TableCell>No writers found</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                filteredWriters.map((writer) => {
                  const status = getWriterStatus(writer.lastLogin);
                  return (
                    <TableRow key={writer._id}>
                      <TableCell>{`${writer.firstName} ${writer.lastName}`}</TableCell>
                      <TableCell>{writer.email}</TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(status)}
                          variant="flat"
                          size="sm"
                        >
                          {getStatusLabel(status)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="bordered"
                              size="sm"
                              color={writer.permit === 'Allowed' ? 'success' : 'danger'}
                            >
                              {writer.permit}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Permit Actions"
                            onAction={async (key) => {
                              try {
                                const response = await fetch(`/api/writers/${writer._id}/permit`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ permit: key })
                                });
                                if (response.ok) {
                                  const updatedWriters = writers.map(w =>
                                    w._id === writer._id ? { ...w, permit: key as 'Allowed' | 'Restricted' } : w
                                  );
                                  setWriters(updatedWriters);
                                } else {
                                  console.error('Failed to update permit status');
                                }
                              } catch (error) {
                                console.error('Error updating permit status:', error);
                              }
                            }}
                          >
                            <DropdownItem key="Allowed" color="success">Allowed</DropdownItem>
                            <DropdownItem key="Restricted" color="danger">Restricted</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                      <TableCell>{formatDate(writer.lastLogin)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="light"
                            onClick={() => handleEditClick(writer)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <ModalHeader>Add New Writer</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={newWriter.email}
                  onChange={(e) => setNewWriter({ ...newWriter, email: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  value={newWriter.password}
                  onChange={(e) => setNewWriter({ ...newWriter, password: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={newWriter.firstName}
                  onChange={(e) => setNewWriter({ ...newWriter, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={newWriter.lastName}
                  onChange={(e) => setNewWriter({ ...newWriter, lastName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Designation"
                  placeholder="e.g. Senior Content Writer"
                  value={newWriter.designation}
                  onChange={(e) => setNewWriter({ ...newWriter, designation: e.target.value })}
                />
                <Input
                  label="Profile Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={newWriter.profileImage}
                  onChange={(e) => setNewWriter({ ...newWriter, profileImage: e.target.value })}
                />
              </div>
              
              <Textarea
                label="Description"
                placeholder="Writer bio or description"
                value={newWriter.description}
                onChange={(e) => setNewWriter({ ...newWriter, description: e.target.value })}
              />
              
              <p className="font-medium text-sm">Social Media Links</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                  value={newWriter.socials.twitter}
                  onChange={(e) => setNewWriter({
                    ...newWriter,
                    socials: { ...newWriter.socials, twitter: e.target.value }
                  })}
                />
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  value={newWriter.socials.linkedin}
                  onChange={(e) => setNewWriter({
                    ...newWriter,
                    socials: { ...newWriter.socials, linkedin: e.target.value }
                  })}
                />
                <Input
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                  value={newWriter.socials.facebook}
                  onChange={(e) => setNewWriter({
                    ...newWriter,
                    socials: { ...newWriter.socials, facebook: e.target.value }
                  })}
                />
                <Input
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                  value={newWriter.socials.instagram}
                  onChange={(e) => setNewWriter({
                    ...newWriter,
                    socials: { ...newWriter.socials, instagram: e.target.value }
                  })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddWriter}>
              Add Writer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="3xl">
        <ModalContent>
          <ModalHeader>Edit Writer</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Designation"
                  placeholder="e.g. Senior Content Writer"
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                />
                <Input
                  label="Profile Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={editForm.profileImage}
                  onChange={(e) => setEditForm({ ...editForm, profileImage: e.target.value })}
                />
              </div>
              
              <Textarea
                label="Description"
                placeholder="Writer bio or description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              
              <p className="font-medium text-sm">Social Media Links</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                  value={editForm.socials.twitter}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, twitter: e.target.value }
                  })}
                />
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  value={editForm.socials.linkedin}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, linkedin: e.target.value }
                  })}
                />
                <Input
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                  value={editForm.socials.facebook}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, facebook: e.target.value }
                  })}
                />
                <Input
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                  value={editForm.socials.instagram}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    socials: { ...editForm.socials, instagram: e.target.value }
                  })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleEditSubmit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}