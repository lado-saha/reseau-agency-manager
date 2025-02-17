import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Function to determine the file path based on entity name
const getFilePath = (entity: string) =>
  path.join(process.cwd(), 'public', 'db', `${entity}.json`);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> } // Extract entity from URL
) {
  try {
    const data = await request.json();
    const {entity} = await params
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
      { message: `Error creating ${(await params).entity}`, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const data = await request.json();
    const {entity} = await params;
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
      { message: `Error updating ${(await params).entity}`, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: `Missing ID parameter` },
        { status: 400 }
      );
    }

    const {entity }= await params
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

    const newEntities = entities.filter((item: any) => item.id !== id);

    if (newEntities.length === entities.length) {
      return NextResponse.json(
        { message: `${entity} with ID ${id} not found` },
        { status: 404 }
      );
    }

    await fs.writeFile(filePath, JSON.stringify(newEntities, null, 2));

    return NextResponse.json({ message: `${entity} deleted successfully` });
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting ${(await params).entity}`, error: (error as Error).message },
      { status: 500 }
    );
  }
}
