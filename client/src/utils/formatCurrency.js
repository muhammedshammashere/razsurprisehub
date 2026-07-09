export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount || 0
  );

export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1513885535751-8b923fbd345a?w=400';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return `${apiUrl.replace('/api', '')}${url}`;
  }
  return url;
};
