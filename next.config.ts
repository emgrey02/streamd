import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                port: '',
                pathname: '/t/p/**',
            },
        ],
        unoptimized: true,
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
