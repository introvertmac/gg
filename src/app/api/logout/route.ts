import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const response = await axios.post(
      'https://sandbox-api.okto.tech/api/v1/logout',
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    return NextResponse.json({ message: 'Logout successful' }, { status: response.status });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Logout failed' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}