import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

async function getUsers() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read users data:', err);
    return [];
  }
}

async function saveUsers(users: any[]) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to save users data:', err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  const users = await getUsers();
  let user = users.find((u: any) => u.email === email);
  
  // Fallback to the first 'user' role if email isn't provided or found (for simplicity in mock)
  if (!user) {
    user = users.find((u: any) => u.role === 'user');
  }
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  let body: any = {};
  
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    // Reconstruct body from formData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Convert File to base64 for the mock db
        const buffer = await value.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        body[key] = `data:${value.type};base64,${base64}`;
      } else {
        body[key] = value;
      }
    }
  } else {
    body = await request.json();
  }

  const users = await getUsers();
  
  const index = users.findIndex((u: any) => u.id === body.id || u.email === body.email);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...body };
    await saveUsers(users);
    return NextResponse.json({ ...users[index], success: true });
  }
  
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
