"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { Book } from "./types/BookTypes";

interface SearchResponse {
  items?: Book[];
}

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [previewBooks, setPreviewBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | undefined>();

  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPreviewBooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
          searchQuery
        )}&maxResults=${10}`
      );
      const data: SearchResponse = await response.json();

      setPreviewBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }

    if (query) {
      setShowPreview(true);
      // Set new timeout
      const timeout = window.setTimeout(() => {
        searchBooks(query);
      }, 300);
      setSearchTimeout(timeout);
    } else {
      setShowPreview(false);
      setPreviewBooks([]);
    }

    // Cleanup timeout on unmount or when query changes
    return () => {
      if (searchTimeout) {
        window.clearTimeout(searchTimeout);
      }
    };
  }, [query]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".search-container")) {
      setShowPreview(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="relative search-container">
        <div className="relative flex">
          <Input
            type="text"
            placeholder="Search for books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchBooks(query)}
            className="flex-1 pr-10"
          />
          <Search
            onClick={() => searchBooks(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4 text-gray-500"
          />
        </div>

        {/* Preview dropdown */}
        {showPreview && previewBooks.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-auto">
            {previewBooks.map((book) => (
              <div
                key={book.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setQuery(book.volumeInfo.title);
                  setShowPreview(false);
                  searchBooks(book.volumeInfo.title);
                }}
              >
                <Image
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "/api/placeholder/40/60"
                  }
                  alt={book.volumeInfo.title}
                  width={40}
                  height={60}
                  className="w-10 h-14 object-cover"
                />
                <div>
                  <p className="font-medium">{book.volumeInfo.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
