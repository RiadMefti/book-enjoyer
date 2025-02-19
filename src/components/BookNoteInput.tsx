"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookNote } from "@/app/types/BookTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface BookNoteInputProps {
  onAddNote: (note: Omit<BookNote, "id" | "createdAt">) => void;
  currentPage?: number;
}

export const BookNoteInput = ({
  onAddNote,
  currentPage,
}: BookNoteInputProps) => {
  const [content, setContent] = React.useState("");
  const [page, setPage] = React.useState<number | undefined>(currentPage);
  const [type, setType] = React.useState<BookNote["type"]>("note");
  const [category, setCategory] = React.useState("general");

  const handleSubmit = () => {
    if (!content.trim()) return;

    onAddNote({
      content,
      page,
      type,

      color: getCategoryColor(category),
    });

    setContent("");
    setPage(currentPage);
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      general: "blue",
      character: "purple",
      plot: "green",
      quote: "yellow",
      theme: "red",
    };
    return colors[cat as keyof typeof colors] || "gray";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick">
          <TabsList className="mb-4">
            <TabsTrigger value="quick">Quick Note</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Note</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your quick note here..."
                className="flex-1"
              />
              <Button onClick={handleSubmit} disabled={!content.trim()}>
                Add
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Page</Label>
                <Input
                  type="number"
                  placeholder="Page #"
                  value={page || ""}
                  onChange={(e) =>
                    setPage(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(value: BookNote["type"]) => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">💭 Note</SelectItem>
                    <SelectItem value="sentiment">💝 Sentiment</SelectItem>
                    <SelectItem value="critique">🤔 Critique</SelectItem>
                    <SelectItem value="question">❓ Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="character">Character</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="theme">Theme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Note</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your detailed note here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="ml-auto"
              >
                Add Note
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookNoteInput;
