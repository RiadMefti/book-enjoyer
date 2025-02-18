export interface BookVolumeInfo {
  publishedDate: string;
  pageCount: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
}

export interface Book {
  id: string;
  volumeInfo: BookVolumeInfo;
}

export type ReadingStatus = "to-read" | "in-progress" | "finished";

export interface ReadingBook extends Book {
  readingStatus: ReadingStatus;
  addedAt: Date;
}
