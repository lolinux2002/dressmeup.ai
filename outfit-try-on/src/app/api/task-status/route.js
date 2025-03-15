import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.PIAPI_URL;
    const apiKey = process.env.PIAPI_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'API configuration is missing' },
        { status: 500 }
      );
    }

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

    const taskData = response.data?.data;

    // Log task status for debugging
    console.log('Task Status:', {
      taskId,
      status: taskData?.status,
      hasError: !!taskData?.error,
      hasOutput: !!taskData?.output
    });

    // If task failed, return error
    if (taskData?.status === 'failed') {
      return NextResponse.json(
        {
          status: 'failed',
          error: taskData.error?.message || 'Task failed',
          details: taskData.error?.raw_message || 'Unknown error'
        },
        { status: 500 }
      );
    }

    // If task is completed, return the result
    if (taskData?.status === 'completed' && taskData?.output?.works?.[0]?.url) {
      return NextResponse.json({
        status: 'completed',
        result_url: taskData.output.works[0].url
      });
    }

    // If task is still processing
    return NextResponse.json({
      status: taskData?.status || 'processing',
      message: 'Task is still processing'
    });

  } catch (error) {
    console.error('Error checking task status:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return NextResponse.json(
      {
        error: error.response?.data?.error?.message || error.message || 'Failed to check task status',
        details: error.response?.data?.error?.raw_message || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 