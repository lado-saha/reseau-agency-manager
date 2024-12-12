// /pages/api/seed.ts
import { runSeed } from '@/lib/seeders/seed-resman';

export async function GET() {
  try {
    await runSeed();
    return Response.json({ Job: 'Success' });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Failed to seed data' });
  }
}
