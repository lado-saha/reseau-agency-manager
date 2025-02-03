// // src/app/api/users/route.ts
// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request: Request) {
//   const data = await request.json();

//   const filePath = path.join(process.cwd(), 'public', 'db', 'users.json');
//   const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//   users.push(data);

//   fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

//   return NextResponse.json({ message: 'User created successfully' });
// }
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const filePath = path.join(process.cwd(), 'public', 'db', 'users.json');
    let users;

    // Read the file asynchronously, and parse the JSON
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      users = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist or read fails, initialize an empty array
      users = [];
    }

    // Add new user to the users array
    users.push(data);

    // Write the updated users array back to the file asynchronously
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating user', error: (error as Error).message },
      { status: 500 }
    );
  }
}
