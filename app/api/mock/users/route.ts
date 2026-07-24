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
      role: newUser.role || 'user',
      apiLimit: newUser.apiLimit || 100000,
      tokensUsed: newUser.tokensUsed || 0,
      apiUsed: newUser.apiUsed || 0,
      createdAt: newUser.createdAt,
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
