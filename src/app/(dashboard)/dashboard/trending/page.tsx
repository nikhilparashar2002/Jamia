"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";

interface TrendingContent {
  _id: string;
  blogId: {
    _id: string;
    title: string;
    slug: string;
  };
  position: number;
}

interface BlogContent {
  _id: string;
  title: string;
  slug: string;
}

export default function TrendingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>([]);
  const [availableContent, setAvailableContent] = useState<BlogContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTrending, setNewTrending] = useState({
    blogId: "",
    position: 0,
  });
  const [editingTrending, setEditingTrending] =
    useState<TrendingContent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch both trending content and available content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [trendingResponse, contentResponse] = await Promise.all([
          fetch("/api/seo/content/trending"),
          fetch("/api/seo/content?status=published"),
        ]);

        if (trendingResponse.ok && contentResponse.ok) {
          const [trendingData, contentData] = await Promise.all([
            trendingResponse.json(),
            contentResponse.json(),
          ]);
          setTrendingContent(trendingData);
          setAvailableContent(contentData.contents);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Redirect if not admin
  if (session?.user?.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const handleAddTrending = async () => {
    try {
      // Ensure position is a number
      const trendingData = {
        blogId: newTrending.blogId,
        position: Number(newTrending.position),
      };

      const response = await fetch("/api/seo/content/trending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trendingData),
      });

      if (response.ok) {
        onClose();
        const updatedResponse = await fetch("/api/seo/content/trending");
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setTrendingContent(data);
        }
        setNewTrending({ blogId: "", position: 0 });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add trending content");
      }
    } catch (error) {
      console.error("Error adding trending content:", error);
      alert("Failed to add trending content");
    }
  };

  const handleRemoveTrending = async (id: string) => {
    try {
      const response = await fetch(`/api/seo/content/trending/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the local state to remove the deleted item
        setTrendingContent((prev) => prev.filter((item) => item._id !== id));
        alert("Trending content removed successfully");
      } else {
        const error = await response.text();
        throw new Error(error || "Failed to delete trending content");
      }
    } catch (error) {
      console.error("Error removing trending content:", error);
      alert("Failed to remove trending content");
    }
  };

  const handleEditClick = (content: TrendingContent) => {
    setEditingTrending(content);
    setIsEditModalOpen(true);
  };

  const handleEditTrending = async () => {
    if (!editingTrending) return;

    try {
      const response = await fetch(`/api/seo/content/trending`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: editingTrending.blogId._id,
          trendingId: editingTrending._id,
          position: Number(editingTrending.position),
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        const updatedResponse = await fetch("/api/seo/content/trending");
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setTrendingContent(data);
        }
        setEditingTrending(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update trending content");
      }
    } catch (error) {
      console.error("Error updating trending content:", error);
      alert("Failed to update trending content");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trending Content Management</h1>
        <Button color="primary" onPress={onOpen}>
          Add Trending
        </Button>
      </div>

      <Card>
        <CardBody>
          <Table aria-label="Trending content table">
            <TableHeader>
              <TableColumn>Title</TableColumn>
              <TableColumn>Slug</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell>Loading trending content...</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : trendingContent.length === 0 ? (
                <TableRow>
                  <TableCell>No trending content found</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : (
                trendingContent.map((content) => (
                  <TableRow key={content._id}>
                    <TableCell>{content.blogId.title}</TableCell>
                    <TableCell>{content.blogId.slug}</TableCell>
                    <TableCell>{content.position}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="light"
                          onPress={() => handleEditClick(content)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => handleRemoveTrending(content._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add New Trending Content</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Select Content"
                placeholder="Choose content to add"
                selectedKeys={[newTrending.blogId]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setNewTrending({ ...newTrending, blogId: selectedKey });
                }}
              >
                {availableContent.map((content) => (
                  <SelectItem key={content._id} value={content._id}>
                    {content.title}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Position"
                placeholder="Select position"
                selectedKeys={[newTrending.position.toString()]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setNewTrending({
                    ...newTrending,
                    position: parseInt(selectedKey),
                  });
                }}
              >
                {[0, 1, 2, 3].map((pos) => (
                  <SelectItem key={pos.toString()} value={pos.toString()}>
                    Position {pos}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddTrending}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Edit Trending Content</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="Select Content"
                placeholder="Choose content to add"
                selectedKeys={[editingTrending?.blogId._id || ""]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setEditingTrending((prev) =>
                    prev
                      ? {
                          ...prev,
                          blogId: {
                            ...prev.blogId,
                            _id: selectedKey,
                          },
                        }
                      : null
                  );
                }}
              >
                {availableContent.map((content) => (
                  <SelectItem key={content._id} value={content._id}>
                    {content.title}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Position"
                placeholder="Select position"
                selectedKeys={[editingTrending?.position.toString() || "0"]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setEditingTrending((prev) =>
                    prev
                      ? {
                          ...prev,
                          position: parseInt(selectedKey),
                        }
                      : null
                  );
                }}
              >
                {[0, 1, 2, 3].map((pos) => (
                  <SelectItem key={pos.toString()} value={pos.toString()}>
                    Position {pos}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" onPress={handleEditTrending}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
