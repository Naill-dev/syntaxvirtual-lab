// file: app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://syntaxvirtual.com';

  const labRoutes = [
    '',
    '/lab',
    '/lab/playground',
    '/lab/tools',
    '/lab/tools/regex',
    '/lab/tools/sql',
    '/lab/tools/api-mock',
    '/lab/tools/boilerplate',
    '/lab/simulators',
    '/lab/simulators/sorting',
    '/lab/simulators/searching',
    '/lab/simulators/data-structures',
    '/lab/simulators/graph',
    '/lab/simulators/network',
    '/lab/simulators/server',
    '/lab/simulators/cloud',
    '/lab/snippets',
  ];

  return labRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' || route === '/lab' || route === '/lab/playground' ? 1 : 0.8,
  }));
}

// ✅ Verified: Static Sitemap Generation for SEO
