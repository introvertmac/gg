import { NextResponse } from 'next/server';
import { ActionsJson, ACTIONS_CORS_HEADERS } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/checkout/:id",
        apiPath: "/api/actions/checkout/:id",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: {
      ...ACTIONS_CORS_HEADERS,
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const OPTIONS = GET;