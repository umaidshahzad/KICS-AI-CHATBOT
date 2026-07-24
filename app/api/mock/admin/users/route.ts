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

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const users = await getUsers();
  const index = users.findIndex((u: any) => u.id === body.id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...body };
    await saveUsers(users);
    return NextResponse.json(users[index]);
  }
  
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const users = await getUsers();
  const newUser = {
    id: `u-${Date.now()}`,
    name: body.name,
    email: body.email,
    role: 'user',
    apiLimit: 100000,
    tokensUsed: 0,
    apiUsed: 0,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  users.push(newUser);
  await saveUsers(users);
  return NextResponse.json(newUser, { status: 201 });
}
