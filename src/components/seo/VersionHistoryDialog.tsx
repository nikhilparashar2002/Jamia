'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';

interface Version {
  _id: string;
  version: number;
  content: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'review';
  updatedAt: string;
  updatedBy: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
}

export default function VersionHistoryDialog({ isOpen, onClose, contentId }: VersionHistoryDialogProps) {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);
  const [comparing, setComparing] = React.useState(false);

  React.useEffect(() => {
    const fetchVersions = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/seo/content/${contentId}/versions`);
        if (response.ok) {
          const data = await response.json();
          setVersions(data.versions);
        } else {
          console.error('Failed to fetch versions');
        }
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [contentId, isOpen]);

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
      return [prev[1], versionId];
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length !== 2) return;
    setComparing(true);
    // TODO: Implement version comparison logic
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Version History
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center gap-4">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
                  <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-4 h-4 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <p className="text-xl font-medium text-gray-600 animate-pulse">Loading versions...</p>
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No version history available
            </div>
          ) : (
            <Table aria-label="Version history table">
              <TableHeader>
                <TableColumn>VERSION</TableColumn>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>UPDATED BY</TableColumn>
                <TableColumn>UPDATED AT</TableColumn>
                <TableColumn>COMPARE</TableColumn>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version._id}>
                    <TableCell>v{version.version}</TableCell>
                    <TableCell>{version.title}</TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={version.status === 'published' ? 'success' : version.status === 'review' ? 'warning' : 'default'}
                        variant="flat"
                      >
                        {version.status}
                      </Chip>
                    </TableCell>
                    <TableCell>{`${version.updatedBy.firstName} ${version.updatedBy.lastName}`}</TableCell>
                    <TableCell>{formatDate(version.updatedAt)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color={selectedVersions.includes(version._id) ? 'primary' : 'default'}
                        variant={selectedVersions.includes(version._id) ? 'solid' : 'bordered'}
                        onPress={() => handleVersionSelect(version._id)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            onPress={handleCompare}
            isDisabled={selectedVersions.length !== 2}
          >
            Compare Selected Versions
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}