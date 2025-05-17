/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // wildcard not officially supported, see note below
          },
        ],
      },
    
};

export default nextConfig;
