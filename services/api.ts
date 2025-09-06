export const fetchHomeImage = async (): Promise<string> => {
  const response = await fetch('http://192.168.1.18:8080/api/images/homeImage');
  if (response.ok) {
    return response.url;
  }
  throw new Error('Failed to fetch image');
};

export const fetchStoreImages = async (): Promise<{ name: string; data: string }[]> => {
  const response = await fetch('http://192.168.1.18:8080/api/images/mobile');
  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to fetch images');
};
