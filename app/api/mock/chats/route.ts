import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from 'fs/promises';
import path from 'path';

const mockChats = [
  {
    id: 'chat_1',
    title: 'Project Planning',
    lastUpdated: new Date().toISOString(),
    messages: [
      { id: 'm1', role: 'user', content: 'Help me plan a project.', timestamp: new Date().toISOString() },
      { id: 'm2', role: 'assistant', content: 'Sure, what kind of project?', timestamp: new Date().toISOString() }
    ]
  }
];

export async function GET() {
  return NextResponse.json(mockChats);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, message } = body;
  
  // 1. Get User Session
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Read users.json to check status and tokens
  const dataFilePath = path.join(process.cwd(), 'data', 'users.json');
  let users = [];
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    console.error('Failed to read users data:', err);
  }

  const userIndex = users.findIndex((u: any) => u.email === userEmail);
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const currentUser = users[userIndex];

  // 3. Enforce Restrictions
  if (currentUser.status === 'restricted') {
    return NextResponse.json({ error: 'Your account has been restricted by an administrator. You cannot use the chatbot.' }, { status: 403 });
  }

  // 4. Enforce Token Limits
  if (currentUser.tokensUsed >= currentUser.apiLimit) {
    return NextResponse.json({ error: 'You have reached your token limit. Please contact an administrator to increase your limit.' }, { status: 403 });
  }

  // Mock artificial delay to simulate backend processing
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Increment tokens (mock 50 tokens per message)
  currentUser.tokensUsed = (currentUser.tokensUsed || 0) + 50;
  users[userIndex] = currentUser;
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to save users data:', err);
  }
  
  const aiResponse = {
    id: `m_${Date.now()}`,
    role: 'assistant',
    content: `This is a mock response from the AI for your message: "${message.content}"`,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json({ success: true, aiResponse });
}
