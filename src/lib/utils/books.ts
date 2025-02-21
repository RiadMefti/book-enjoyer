export const getBookCoverUrl = (
  imageLinks?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    small?: string;
    thumbnail?: string;
    smallThumbnail?: string;
  },
  preferHighRes: boolean = false
) => {
  if (!imageLinks) return "/placeholder-book.jpg";

  if (preferHighRes) {
    // For book detail page, try to get the highest quality available

    const imageUrl =
      imageLinks.extraLarge ||
      imageLinks.large ||
      imageLinks.medium ||
      imageLinks.small ||
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail;
    console.log(imageUrl);
    if (!imageUrl) return "/placeholder-book.jpg";

    return imageUrl;
  }

  // For reading list, just use thumbnail
  return imageLinks.thumbnail || "/placeholder-book.jpg";
};
