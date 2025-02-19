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
import { Label } from "@/components/ui/label";

interface BookNoteInputProps {
  onAddNote: (note: Omit<BookNote, "id" | "createdAt">) => void;
}

export const BookNoteInput = ({ onAddNote }: BookNoteInputProps) => {
  const [content, setContent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<BookNote["type"]>("note");
  const [page, setPage] = React.useState<number | undefined>(undefined);

  const handleSubmit = () => {
    if (!content.trim() || !title.trim()) return;

    onAddNote({
      title,
      content,
      type,
      page,
    });

    setContent("");
    setTitle("");
    setPage(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
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
                  <SelectItem value="question">❓ Question</SelectItem>
                  <SelectItem value="critique">🤔 Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Page (optional)</Label>
              <Input
                type="number"
                value={page ?? ""}
                onChange={(e) =>
                  setPage(e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="Page number"
              />
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
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
        </div>
      </CardContent>
    </Card>
  );
};

export default BookNoteInput;
