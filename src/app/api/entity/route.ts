import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = (entity: string) => path.join(process.cwd(), 'public', 'db', `${entity}.json`);

export async function POST(request: Request, entity: string) {
  try {
    const data = await request.json();
    const filePath = getFilePath(entity);
    let entities;

    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      entities = JSON.parse(fileData);
    } catch {
      entities = [];
    }

    entities.push(data);

    await fs.writeFile(filePath, JSON.stringify(entities, null, 2));

    return NextResponse.json({ message: `${entity} created successfully` });
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating ${entity}`, error: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request, entity: string) {
  try {
    const data = await request.json();
    const filePath = getFilePath(entity);
    let entities;

    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      entities = JSON.parse(fileData);
    } catch {
      return NextResponse.json(
        { message: `${entity} data not found` },
        { status: 404 }
      );
    }

    const index = entities.findIndex((item: any) => item.id === data.id);
    if (index === -1) {
      return NextResponse.json(
        { message: `${entity} with ID ${data.id} not found` },
        { status: 404 }
      );
    }

    entities[index] = { ...entities[index], ...data };

    await fs.writeFile(filePath, JSON.stringify(entities, null, 2));

    return NextResponse.json({ message: `${entity} updated successfully` });
  } catch (error) {
    return NextResponse.json(
      { message: `Error updating ${entity}`, error: (error as Error).message },
      { status: 500 }
    );
  }
}
