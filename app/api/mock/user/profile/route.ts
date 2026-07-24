import { NextResponse } from 'next/server';

const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'user@example.com',
  role: 'user',
  avatarUrl: '/avatar.png',
  preferences: {
    theme: 'light',
    notifications: true
  }
};

export async function GET() {
  return NextResponse.json(mockProfile);
}

export async function PUT(request: Request) {
  const body = await request.json();
  // Return the updated mock profile
  return NextResponse.json({ ...mockProfile, ...body, success: true });
}
