import type { MetadataRoute } from 'next';

// The TMDB id space is effectively unbounded (~1M movies, ~250k shows, ~4.7M
// people), and every detail page links out to cast, recommendations, similar
// titles and keywords -- a fully connected graph over millions of URLs. Letting
// crawlers walk it generated tens of millions of cache writes a month, so only
// the curated surface in sitemap.ts is crawlable.
export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ?? 'https://streamd.vercel.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/$', '/movies/', '/shows/', '/trending/'],
                disallow: [
                    '/movie/',
                    '/tv/',
                    '/person/',
                    '/search/',
                    '/dashboard/',
                    '/signin',
                    '/approval',
                    '/logout',
                ],
            },
            // These ignore crawl-delay and account for a large share of the
            // traffic, with no upside for a project like this.
            {
                userAgent: [
                    'GPTBot',
                    'CCBot',
                    'ClaudeBot',
                    'Google-Extended',
                    'anthropic-ai',
                    'Bytespider',
                    'PetalBot',
                    'SemrushBot',
                    'AhrefsBot',
                    'MJ12bot',
                    'DotBot',
                    'DataForSeoBot',
                ],
                disallow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
