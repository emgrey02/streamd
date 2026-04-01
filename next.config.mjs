/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                port: '',
                pathname: '/t/p/**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: false,
        tsConfigPath: 'tsconfig.json',
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
