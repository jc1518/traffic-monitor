const STORAGE_KEY = 'nsw_image_urls';

export const saveImageUrls = async (urls: string[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  } catch (error) {
    console.error('Error saving image URLs:', error);
  }
};

export const loadImageUrls = async (): Promise<string[]> => {
  const urls = localStorage.getItem(STORAGE_KEY);
  return urls ? JSON.parse(urls) : [];
};
