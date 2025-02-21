export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  pageCount: number;
  publishedDate?: string;
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  categories?: string[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export type ReadingStatus = "to-read" | "in-progress" | "finished";
export type NoteType = "note" | "sentiment" | "critique" | "question";

export interface BookNote {
  id: string;
  title: string; // new field
  content: string;
  createdAt: Date;
  type: NoteType;
  category?: string;
  emoji?: string;
  color?: string;
  page?: number; // optional page field
}

export interface ReadingBook extends GoogleBook {
  readingStatus: ReadingStatus;
  addedAt: Date;
  notes: BookNote[];
  currentPage: number;
  rating?: number;
}

export interface DbBook {
  id: number;
  googleBookId: string;
  userId: number;
  status: ReadingStatus;
  addedAt: string;
  updatedAt: string;
}
