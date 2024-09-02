export const saveImageUrls = async (
  storageKey: string,
  urls: string[]
): Promise<void> => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(urls));
  } catch (error) {
    console.error("Error saving image URLs:", error);
  }
};

export const loadImageUrls = async (storageKey: string): Promise<string[]> => {
  const urls = localStorage.getItem(storageKey);
  return urls ? JSON.parse(urls) : [];
};
