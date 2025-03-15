import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasApiUrl: !!process.env.PIAPI_URL,
    hasApiKey: !!process.env.PIAPI_KEY,
    apiUrl: process.env.PIAPI_URL,
    // Don't expose the actual API key
    apiKeyLength: process.env.PIAPI_KEY?.length
  });
} 