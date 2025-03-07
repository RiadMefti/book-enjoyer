"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { GoogleBook } from "../../types/BookTypes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createBook } from "@/app/actions/books";
import { generateBookSummary } from "@/app/actions/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchRecommendedBooks } from "@/app/actions/recommendations";

interface SearchResponse {
  items?: GoogleBook[];
}

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [previewBooks, setPreviewBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | undefined>();
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [bookSummary, setBookSummary] = useState<string | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<GoogleBook[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);

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

  // Naive parser: looks for lines with "GoogleBookID: something"
  // Parse AI response to get just the titles
  function parseTitles(aiResponse: string): string[] {
    return aiResponse
      .split("\n")
      .filter((line) => line.startsWith("TITLE:"))
      .map((line) => line.replace("TITLE:", "").trim());
  }

  // Search Google Books API for a specific title
  async function searchBookByTitle(title: string): Promise<GoogleBook | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(
          title
        )}"&maxResults=1`
      );
      const data: SearchResponse = await response.json();
      return data.items?.[0] || null;
    } catch (error) {
      console.error(`Error searching for book "${title}":`, error);
      return null;
    }
  }

  // Fetch recommendations
  async function loadRecommendations() {
    setIsLoadingRecommendations(true);
    try {
      const aiResponse = await fetchRecommendedBooks();
      if (!aiResponse) return;

      const titles = parseTitles(aiResponse);
      const books = await Promise.all(
        titles.map((title) => searchBookByTitle(title))
      );

      setRecommendedBooks(
        books.filter((book): book is GoogleBook => book !== null)
      );
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

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

  const addBookToReadingList = async (book: GoogleBook) => {
    try {
      await createBook(book.id);
      setSelectedBook(null);
      // Redirect to reading list after successful addition
      window.location.href = "/reading-list";
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  const handleSummary = async () => {
    if (!selectedBook) return;
    setIsGeneratingSummary(true);
    try {
      const summary = await generateBookSummary(
        selectedBook.volumeInfo.title,
        selectedBook.volumeInfo.authors?.join(", ") || "Unknown Author",
        selectedBook.volumeInfo.description || "No description available"
      );
      setBookSummary(summary);
    } catch (error) {
      alert("Could not retrieve summary." + error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const LoadingBookPreview = () => (
    <div className="p-4 flex items-center gap-4">
      <Skeleton className="w-12 h-16" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  );

  const LoadingBookDetails = () => (
    <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex gap-8">
        <Skeleton className="w-[200px] h-[300px] flex-shrink-0" />
        <div className="flex-grow space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-4 items-center pt-4">
            <Skeleton className="h-10 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-8">
        {/* Hero Search Section */}
        <div
          className={`transition-all duration-300 ${
            selectedBook ? "h-24" : "h-[30vh]" // Reduced from 40vh to 30vh
          } flex flex-col justify-start pt-8`} // Reduced from pt-12 to pt-8
        >
          <h1
            className={`text-center mb-6 transition-all duration-300 ${
              // Reduced from mb-8 to mb-6
              selectedBook ? "text-2xl" : "text-4xl"
            }`}
          >
            Find Your Next Book
          </h1>
          <div className="relative search-container max-w-2xl mx-auto w-full">
            <div className="relative flex">
              <Input
                type="text"
                placeholder="Search for books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchBooks(query)}
                className="flex-1 pr-10 h-12 text-lg"
              />
              <Search
                onClick={() => searchBooks(query)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-6 h-6 text-gray-500"
              />
            </div>

            {/* Preview dropdown */}
            {showPreview && (loading || previewBooks.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-auto">
                {loading ? (
                  <>
                    <LoadingBookPreview />
                    <LoadingBookPreview />
                    <LoadingBookPreview />
                  </>
                ) : (
                  previewBooks.map((book) => (
                    <div
                      key={book.id}
                      className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
                      onClick={() => {
                        setSelectedBook(book);
                        setShowPreview(false);
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
                        className="w-12 h-16 object-cover"
                      />
                      <div>
                        <p className="font-medium">{book.volumeInfo.title}</p>
                        <p className="text-sm text-gray-600">
                          {book.volumeInfo.authors?.join(", ") ||
                            "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section with reduced top margin */}
        {(isLoadingRecommendations || recommendedBooks.length > 0) &&
          !selectedBook && (
            <div className="-mt-4 bg-white p-6 rounded-md shadow-md">
              {" "}
              {/* Changed from mt-2 to -mt-4 */}
              <h2 className="text-2xl font-semibold mb-4">
                Recommended for You
              </h2>
              <div className="space-y-2">
                {isLoadingRecommendations ? (
                  <div className="space-y-4">
                    <LoadingBookPreview />
                    <LoadingBookPreview />
                    <LoadingBookPreview />
                  </div>
                ) : (
                  recommendedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                      onClick={() => setSelectedBook(book)}
                    >
                      <Image
                        src={
                          book.volumeInfo.imageLinks?.thumbnail ||
                          "/api/placeholder/40/60"
                        }
                        alt={book.volumeInfo.title}
                        width={40}
                        height={60}
                        className="w-12 h-16 object-cover"
                      />
                      <div>
                        <p className="font-medium">{book.volumeInfo.title}</p>
                        <p className="text-sm text-gray-600">
                          {book.volumeInfo.authors?.join(", ") ||
                            "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        {/* Book Details Section */}
        {selectedBook ? (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <Image
                  src={
                    selectedBook.volumeInfo.imageLinks?.thumbnail ||
                    "/api/placeholder/200/300"
                  }
                  alt={selectedBook.volumeInfo.title}
                  width={200}
                  height={300}
                  className="rounded-md shadow-lg"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-3xl font-bold mb-2">
                  {selectedBook.volumeInfo.title}
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  {selectedBook.volumeInfo.authors?.join(", ") ||
                    "Unknown Author"}
                </p>
                <p className="text-gray-700 mb-6">
                  {selectedBook.volumeInfo.description ||
                    "No description available."}
                </p>
                <div className="flex gap-4 items-center">
                  <Button onClick={() => addBookToReadingList(selectedBook)}>
                    Add to Reading List
                  </Button>
                  <Button
                    onClick={handleSummary}
                    variant="outline"
                    disabled={isGeneratingSummary}
                  >
                    {isGeneratingSummary ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Summarizing...
                      </>
                    ) : (
                      "Get Summary"
                    )}
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p>
                      Published:{" "}
                      {selectedBook.volumeInfo.publishedDate || "Unknown"}
                    </p>
                    <p>
                      Pages: {selectedBook.volumeInfo.pageCount || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Summary Section */}
                {(isGeneratingSummary || bookSummary) && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-4">Book Summary</h3>
                    {isGeneratingSummary ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {bookSummary || ""}
                      </ReactMarkdown>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : loading && query && !showPreview ? (
          <LoadingBookDetails />
        ) : null}
      </div>
    </main>
  );
};

export default BookSearch;
