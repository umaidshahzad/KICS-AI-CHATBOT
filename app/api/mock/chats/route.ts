import { NextResponse } from 'next/server';

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
  
  // Mock artificial delay to simulate backend processing
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const aiResponse = {
    id: `m_${Date.now()}`,
    role: 'assistant',
    content: `This is a mock response from the AI for your message: "${message.content}"`,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json({ success: true, aiResponse });
}
