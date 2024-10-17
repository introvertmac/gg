import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface OktoAuthResponse {
  status: string;
  data: {
    auth_token: string;
    refresh_auth_token: string;
    device_token: string;
    message: string;
  };
}

export async function POST(request: NextRequest) {
  const X_API_KEY = process.env.OKTO_API_SECRET;

  if (!X_API_KEY) {
    console.error('Missing API key');
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const { id_token } = await request.json();

    if (!id_token) {
      return NextResponse.json({ error: 'Missing id_token' }, { status: 400 });
    }

    const oktoResponse = await axios.post<OktoAuthResponse>(
      'https://sandbox-api.okto.tech/api/v2/authenticate',
      { id_token },
      {
        headers: {
          'x-api-key': X_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(oktoResponse.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Authentication error:', error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || 'Authentication failed' },
        { status: error.response?.status || 400 }
      );
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}