import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const requestBody = await request.json();
    
    // Validate request body
    if (!requestBody.model_input) {
      return NextResponse.json(
        { error: 'User image is required' },
        { status: 400 }
      );
    }

    if (!requestBody.upper_input && !requestBody.lower_input) {
      return NextResponse.json(
        { error: 'At least one outfit piece (upper or lower) is required' },
        { status: 400 }
      );
    }

    // Get webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.lolinux2002.com/webhook/outfit-try-on';
    
    console.log('Sending data to n8n webhook:', {
      url: n8nWebhookUrl,
      hasUserImage: !!requestBody.model_input,
      hasUpperOutfit: !!requestBody.upper_input,
      hasLowerOutfit: !!requestBody.lower_input
    });

    // Send data to n8n webhook with a 4-minute timeout
    const response = await axios.post(
      n8nWebhookUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'image/png, application/json'
        },
        timeout: 240000, // 4 minutes timeout
        responseType: 'arraybuffer' // Handle binary response (PNG file)
      }
    );

    // Check if the response is a PNG image
    const contentType = response.headers['content-type'];
    console.log('n8n webhook response content type:', contentType);

    if (contentType && contentType.includes('image/png')) {
      // Convert the binary data to base64
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      console.log('Received PNG image from n8n webhook');
      
      // Return the image as a data URL
      return NextResponse.json({
        result_image_url: dataUrl,
        message: 'Successfully processed images'
      });
    } else {
      // If it's not a PNG, try to parse it as JSON
      try {
        const textData = Buffer.from(response.data).toString('utf-8');
        const jsonData = JSON.parse(textData);
        
        console.log('Received JSON response from n8n webhook:', jsonData);
        
        return NextResponse.json(jsonData);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Unexpected response format from n8n webhook');
      }
    }
  } catch (error) {
    console.error('Error processing with n8n:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data ? 'Binary data' : null,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: error.message || 'Failed to process images with n8n',
        details: 'The request to the n8n webhook timed out or failed'
      },
      { status: error.response?.status || 500 }
    );
  }
} 