import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const requestBody = await request.json();

    if (!requestBody.input?.model_input) {
      return NextResponse.json(
        { error: 'User image is required' },
        { status: 400 }
      );
    }

    if (!requestBody.input?.upper_input && !requestBody.input?.lower_input) {
      return NextResponse.json(
        { error: 'At least one outfit piece (upper or lower) is required' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.PIAPI_URL;
    const apiKey = process.env.PIAPI_KEY;

    // Log environment variables (without exposing the API key)
    console.log('API URL:', apiUrl);
    console.log('API Key present:', !!apiKey);

    if (!apiUrl || !apiKey) {
      console.error('Missing environment variables:', {
        hasApiUrl: !!apiUrl,
        hasApiKey: !!apiKey
      });
      return NextResponse.json(
        { error: 'API configuration is missing. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Call PiAPI with image URLs
    const response = await axios.post(
      apiUrl,
      requestBody,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    // Log the response for debugging
    console.log('API Response:', {
      status: response.status,
      code: response.data?.code,
      hasTaskId: !!response.data?.data?.task_id,
      taskStatus: response.data?.data?.status
    });

    // Check if the response contains the task ID
    if (response.data?.code === 200 && response.data?.data?.task_id) {
      const taskData = response.data.data;
      
      // If the task failed immediately, return the error
      if (taskData.status === 'failed') {
        console.error('Task failed:', taskData.error);
        return NextResponse.json(
          { 
            error: taskData.error?.message || 'Task failed',
            details: taskData.error?.raw_message || 'Unknown error'
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        taskId: taskData.task_id,
        message: 'Task created successfully',
        status: taskData.status
      });
    } else {
      console.error('Invalid API response:', response.data);
      throw new Error('Invalid API response: No task ID received');
    }
  } catch (error) {
    // Enhanced error logging
    console.error('Error processing images:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: error.response?.data?.error?.message || error.message || 'Failed to process images',
        details: error.response?.data?.error?.raw_message || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
} 