/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tranches.s3.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'tranches.s3.us-east-1.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
