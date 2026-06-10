export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
}

export function getApiOrigin() {
  const baseUrl = getApiBaseUrl();
  try {
    return new URL(baseUrl).origin;
  } catch (error) {
    return 'http://localhost:3000';
  }
}

export function getImageUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) {
    return `${getApiOrigin()}${url}`;
  }
  if (url.startsWith('/static/')) {
    return url;
  }
  return url;
}
