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

const nextConfig: import('next').NextConfig = {};

export default withNextIntl(nextConfig);
