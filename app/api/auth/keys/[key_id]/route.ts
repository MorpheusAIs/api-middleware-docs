import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http:api.mor.org';

// Proxy DELETE requests for a specific key ID
export async function DELETE(
    req: Request,
    { params }: any
) {
  const token = await getToken({ req: req as any });

  if (!token || !token.accessToken) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const { key_id } = params;
  if (!key_id) {
    return NextResponse.json({ message: 'Key ID is required' }, { status: 400 });
  }

  const url = `${BACKEND_API_URL}/api/v1/auth/keys/${key_id}`;
  const headers = new Headers(); // Don't forward request headers automatically for DELETE
  headers.set('Authorization', `Bearer ${token.accessToken}`);
  headers.set('Accept', 'application/json'); // Expect JSON response from backend

  try {
    console.log(`Proxying DELETE request to: ${url}`);
    const backendResponse = await fetch(url, {
      method: 'DELETE',
      headers: headers,
      // No body or duplex needed for standard DELETE
    });

    console.log(`Backend DELETE response status: ${backendResponse.status}`);

    // Forward the response from the backend
    // Handle potential 204 No Content specifically
    if (backendResponse.status === 204) {
        return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers, // Forward backend headers (like Content-Type)
    });

  } catch (error) {
    console.error('API Key Delete Proxy Error:', error);
    return NextResponse.json({ message: 'Error proxying delete request to backend' }, { status: 502 });
  }
} 