"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { BookNoteInput } from "@/components/BookNoteInput";
import { ReadingBook, BookNote, ReadingStatus } from "@/app/types/BookTypes";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Trash2, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// New imports for type filter dropdown
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


const getHighResBookCover = (imageLinks?: {
  extraLarge?: string;
  large?: string;
  medium?: string;
  small?: string;
  thumbnail?: string;
}) => {
  if (!imageLinks) return "/placeholder-book.jpg";

  const imageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail;

  if (!imageUrl) return "/placeholder-book.jpg";

  return imageUrl
    .replace("http://", "https://")
    .replace("zoom=1", "zoom=6")
    .replace("&edge=curl", "")
    .replace("&source=gbs_api", "");
};

const cleanHtmlTags = (text: string) => {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
};

const calculateReadingTime = (pageCount: number) => {
  const avgReadingSpeed = 2; // minutes per page
  const totalMinutes = pageCount * avgReadingSpeed;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `~${hours}h ${minutes}m`;
};
type Props = {
  params: Promise<{
    bookId: string
  }>
}

const BookPage = ({ params }: Props) => {
  const { bookId } = use(params); // Unwrap params with React.use()
  
  
  const [book, setBook] = useState<ReadingBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all"); // new state for type filter
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const bookData = await response.json();

        const cleanedDescription = bookData.volumeInfo.description
          ? cleanHtmlTags(bookData.volumeInfo.description)
          : "No description available.";

        setBook({
          ...bookData,
          volumeInfo: {
            ...bookData.volumeInfo,
            description: cleanedDescription,
          },
          readingStatus: "in-progress" as ReadingStatus,
          addedAt: new Date(),
          currentPage: 0,
          notes: [],
        });
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, []);

  const handleStatusChange = (newStatus: ReadingStatus) => {
    if (book) {
      setBook({ ...book, readingStatus: newStatus });
      toast({
        title: "Reading status updated",
        description: `Book marked as "${newStatus.replace("-", " ")}"`,
      });
    }
  };

  const handleAddNote = (note: Omit<BookNote, "id" | "createdAt">) => {
    const newNote: BookNote = {
      ...note,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    toast({
      title: "Note added",
      description: `Added new ${note.type}`,
    });
  };

  const handleUpdateNote = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, content: editingContent } : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
    setEditingContent("");
    toast({
      title: "Note updated",
      description: "Your note has been saved",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    toast({
      title: "Note deleted",
      variant: "destructive",
    });
  };

  const filteredAndSortedNotes = notes
    .filter((note) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term);
      const matchesType =
        selectedType === "all"
          ? true
          : note.type.toLowerCase() === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Function to pick note styling based on type
  const getNoteCardClasses = (type: string) => {
    switch (type) {
      case "question":
        return "border-l-4 border-blue-500";
      case "critique":
        return "border-l-4 border-red-500";
      default: // "note"
        return "border-l-4 border-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-8">
              <div className="w-48 h-72 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return <div className="p-8 text-center">Book not found</div>;
  }

  const statusButtons: { label: string; value: ReadingStatus }[] = [
    { label: "To Read", value: "to-read" },
    { label: "In Progress", value: "in-progress" },
    { label: "Finished", value: "finished" },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="aspect-[2/3] relative bg-gray-100">
                  <Image
                    src={
                      imageError
                        ? "/placeholder-book.jpg"
                        : getHighResBookCover(book.volumeInfo?.imageLinks)
                    }
                    alt={book.volumeInfo.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    priority
                    quality={100}
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>

              <div className="p-8 md:p-10 md:w-2/3 lg:w-3/4 space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                      {book.volumeInfo.title}
                    </h1>
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-medium">
                          {book.volumeInfo.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl text-gray-600">
                    {book.volumeInfo.authors?.join(", ")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {statusButtons.map((button) => (
                    <Button
                      key={button.value}
                      variant={
                        book.readingStatus === button.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleStatusChange(button.value)}
                      className="min-w-[100px]"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-line">
                    {book.volumeInfo.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="font-medium">
                      {book.volumeInfo.publishedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Pages</p>
                    <p className="font-medium">{book.volumeInfo.pageCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reading Time</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {calculateReadingTime(book.volumeInfo.pageCount)}
                    </p>
                  </div>
                </div>

                {book.volumeInfo.categories && (
                  <div className="flex flex-wrap gap-2">
                    {book.volumeInfo.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Notes & Thoughts</h2>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search notes (by title or content)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {/* New filter dropdown for note type */}
              <Select
                value={selectedType}
                onValueChange={(value: string) => setSelectedType(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter By Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                  <SelectItem value="sentiment">Sentiment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <BookNoteInput onAddNote={handleAddNote} />

          <div className="mt-8 space-y-4">
            {filteredAndSortedNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notes found {searchTerm && "matching your search"}
              </div>
            ) : (
              filteredAndSortedNotes.map((note) => (
                <Card
                  key={note.id}
                  className={`p-4 hover:shadow-md transition-shadow ${getNoteCardClasses(
                    note.type
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {note.emoji && <span>{note.emoji}</span>}
                      <Badge variant="secondary">
                        {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                      </Badge>
                      {note.page && (
                        <span className="text-sm text-gray-600">
                          Page {note.page}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingNote(note.id);
                          setEditingContent(note.content);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingNote(null);
                            setEditingContent("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">
                      {note.content}
                    </p>
                  )}

                  <div className="mt-2 text-xs text-gray-500">
                    {note.createdAt.toLocaleString()}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookPage;
