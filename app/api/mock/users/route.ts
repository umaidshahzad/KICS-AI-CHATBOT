import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the users data file
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Helper function to read the users data
function getUsersData() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading users data:', error);
    return [];
  }
}

// Helper function to write users data
function saveUsersData(data: any) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users data:', error);
    return false;
  }
}

export async function GET() {
  const users = getUsersData();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json();
    const users = getUsersData();
    
    // Check for duplicate email
    if (users.some((u: any) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }
    
    // Auto-generate ID if not provided
    if (!newUser.id) {
      newUser.id = `u-${Date.now()}`;
    }
    
    // Set defaults if not provided
    if (!newUser.createdAt) {
      newUser.createdAt = new Date().toISOString();
    }
    
    // Ensure structure matches existing mock users
    const userToSave = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password || 'password123', // Save password for login
      role: newUser.role || 'user',
      apiLimit: newUser.apiLimit || 100000,
      tokensUsed: newUser.tokensUsed || 0,
      apiUsed: newUser.apiUsed || 0,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin || null,
      status: newUser.status || 'active'
    };
    
    users.push(userToSave);
    
    if (saveUsersData(users)) {
      return NextResponse.json(userToSave, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    let users = getUsersData();
    const initialLength = users.length;
    users = users.filter((u: any) => u.id !== id);
    
    if (users.length === initialLength) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (saveUsersData(users)) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
