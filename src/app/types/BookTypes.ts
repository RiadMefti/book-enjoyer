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