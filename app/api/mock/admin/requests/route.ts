import { NextResponse } from 'next/server';

let requests = [
  {
    id: 'req-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    reason: 'I need to generate marketing copy.',
    authType: 'Manual',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    reason: 'OAuth Access Request via Google',
    authType: 'OAuth',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  }
];

export async function GET() {
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRequest = {
    id: `req-${Date.now()}`,
    name: body.name,
    email: body.email,
    reason: body.reason,
    authType: body.authType || 'Manual',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  requests.push(newRequest);
  return NextResponse.json(newRequest, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = requests.findIndex(r => r.id === body.id);
  
  if (index !== -1) {
    requests[index].status = body.status;
    return NextResponse.json(requests[index]);
  }
  
  return NextResponse.json({ error: 'Request not found' }, { status: 404 });
}
