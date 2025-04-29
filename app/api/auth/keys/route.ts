import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_BACKEND_URL = process.env.API_BACKEND_URL || 'http://127.0.0.1:8000';

async function proxyRequest(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const url = `${API_BACKEND_URL}/api/v1/auth/keys`;
  const headers = new Headers(req.headers);
  headers.set('Authorization', `Bearer ${token.accessToken}`);
  headers.delete('host'); // Let the fetch function handle the host header
  headers.delete('cookie'); // Avoid sending browser cookies to the backend

  try {
    const backendResponse = await fetch(url, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      duplex: 'half' // Required when streaming request body with fetch
    } as any); // Cast to any to bypass TS lib type issue

    // Forward the response from the backend
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json({ message: 'Error proxying request to backend' }, { status: 502 }); // Bad Gateway
  }
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
} 