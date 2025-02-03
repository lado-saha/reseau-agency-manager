import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// // Debugging log function
// const log = (message: string, data?: any) => {
//   console.log(`[UPLOAD API] ${message}`, data ?? '');
// };

// Define upload directory
const uploadDir = path.join(process.cwd(), 'public/storage/');

// Ensure the directory exists
const ensureUploadDirExists = async () => {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// ✅ Named `POST` function for Next.js API
export async function POST(req: NextRequest) {

  // Ensure upload directory exists
  await ensureUploadDirExists();

  try {
    // ✅ Read FormData from the request
    const formData = await req.formData();

    // ✅ Get the uploaded file
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    // ✅ Create a unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueName);

    // ✅ Convert file into a Buffer and save it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // ✅ Return the URL to access the uploaded file
    const fileUrl = `/storage/${uniqueName}`;

    return NextResponse.json({ fileUrl: fileUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'File upload failedsd', error: error.message }, { status: 500 });
  }
}
