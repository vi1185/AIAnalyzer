export function revokeObjectURLs(urls: string[]) {
  urls.forEach(url => {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error revoking object URL:', error);
    }
  });
}