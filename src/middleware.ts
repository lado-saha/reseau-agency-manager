export { auth as middleware } from '@/auth';

// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

// const session = await auth();
export const config = {
  matcher: [
    '/((?!api/auth|auth|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|avif|ico|bmp|tiff)$).*)',
  ],
};
