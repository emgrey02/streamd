import type { MetadataRoute } from 'next';

// Deliberately a small fixed set. Listing TMDB detail pages here would invite
// crawlers back into the unbounded id space that robots.ts exists to close off.
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ?? 'https://streamd.vercel.app';

    const paths = [
        '',
        '/movies/now_playing',
        '/movies/popular',
        '/movies/top_rated',
        '/movies/upcoming',
        '/shows/airing_today',
        '/shows/on_the_air',
        '/shows/popular',
        '/shows/top_rated',
        '/trending/all',
        '/trending/movie',
        '/trending/tv',
        '/trending/people',
    ];

    return paths.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: path === '' ? 1 : 0.8,
    }));
}
