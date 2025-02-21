"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { ReadingBook, ReadingStatus, DbBook } from "@/app/types/BookTypes";
import { getBookCoverUrl } from "@/lib/utils/books";

const ReadingListPage = () => {
  const [books, setBooks] = useState<ReadingBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ReadingStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const userBooksResponse = await fetch("/api/books");
        if (!userBooksResponse.ok) {
          throw new Error("Failed to fetch books");
        }
        const userBooks = (await userBooksResponse.json()) as DbBook[];

        const booksPromises = userBooks.map(async (userBook) => {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${userBook.googleBookId}`
          );
          const book = await response.json();
          return {
            ...book,
            readingStatus: userBook.status,
            addedAt: new Date(userBook.addedAt),
          } as ReadingBook;
        });

        const fetchedBooks = await Promise.all(booksPromises);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) =>
        selectedFilter === "all" ? true : book.readingStatus === selectedFilter
      )
      .filter(
        (book) =>
          book.volumeInfo.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          book.volumeInfo.authors?.some((author) =>
            author.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
  }, [books, selectedFilter, searchQuery]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const filterButtons: { label: string; value: ReadingStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "To Read", value: "to-read" },
    { label: "In Progress", value: "in-progress" },
    { label: "Finished", value: "finished" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Reading List</h1>
          <Link href="/books">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Books
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map((button) => (
              <Button
                key={button.value}
                variant={
                  selectedFilter === button.value ? "default" : "outline"
                }
                onClick={() => setSelectedFilter(button.value)}
              >
                {button.label}
              </Button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Link
                href={`/reading-list/${book.id}`}
                key={book.id}
                className="block transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 flex gap-4">
                    <Image
                      src={getBookCoverUrl(book.volumeInfo.imageLinks)}
                      alt={book.volumeInfo.title}
                      width={80}
                      height={120}
                      className="object-cover rounded-md"
                    />
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-semibold line-clamp-2">
                          {book.volumeInfo.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {book.volumeInfo.authors?.join(", ")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            book.readingStatus === "to-read"
                              ? "bg-blue-100 text-blue-800"
                              : book.readingStatus === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {book.readingStatus.replace("-", " ").toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-500">
                          Added: {book.addedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ReadingListPage;
