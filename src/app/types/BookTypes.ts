export interface BookVolumeInfo {
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