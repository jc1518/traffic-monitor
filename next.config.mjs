/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    loader: "custom",
    loaderFile: "./app/utils/imageLoader.ts",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'webcams.transport.nsw.gov.au',
        port: '',
        pathname: '/livetraffic-webcams/cameras/**',
      },
    ],
  },
};

export default nextConfig;
