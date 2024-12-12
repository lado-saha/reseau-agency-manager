// export default {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'avatars.githubusercontent.com'
//       },
//       {
//         protocol: 'https',
//         hostname: '*.public.blob.vercel-storage.com'
//       }
//     ]
//   }
// };
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  reactStrictMode: false
};

export default withNextIntl(nextConfig);
