import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { taskId } = params;
    const apiUrl = process.env.PIAPI_URL;
    const apiKey = process.env.PIAPI_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'API configuration is missing' },
        { status: 500 }
      );
    }

    console.log('Checking status for task:', taskId);

    // Get task status from PiAPI
    const response = await axios.get(
      `${apiUrl}/${taskId}`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Status API Response:', {
      status: response.status,
      code: response.data?.code,
      taskStatus: response.data?.data?.status,
      hasOutput: !!response.data?.data?.output,
      hasWorks: !!response.data?.data?.output?.works,
      hasImage: !!response.data?.data?.output?.works?.[0]?.image,
      hasResourceWithoutWatermark: !!response.data?.data?.output?.works?.[0]?.image?.resource_without_watermark
    });

    // If completed, log the resource_without_watermark URL
    if (response.data?.data?.status === 'completed') {
      const resultUrl = response.data?.data?.output?.works?.[0]?.image?.resource_without_watermark;
      console.log('Result image URL (resource_without_watermark):', resultUrl);
    }

    // Return the task status and result
    return NextResponse.json(response.data?.data || response.data);
  } catch (error) {
    console.error('Error getting task status:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return NextResponse.json(
      { 
        error: error.response?.data?.error?.message || error.message || 'Failed to get task status',
        details: error.response?.data?.error?.raw_message || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 