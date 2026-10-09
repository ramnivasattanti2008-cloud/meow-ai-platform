import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meowboxai.tech';
  const lastModified = new Date();

  const routes = [
    '',
    '/platform',
    '/voice-ai',
    '/ai-services',
    '/growth',
    '/solutions',
    '/about',
    '/pricing',
    '/contact',
    '/book',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}

