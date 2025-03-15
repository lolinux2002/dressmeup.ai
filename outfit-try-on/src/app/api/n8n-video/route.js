import { NextResponse } from 'next/server';
import axios from 'axios';
import { uploadBase64Image } from '../upload/route';
import sharp from 'sharp';

// Keep track of processing requests to avoid duplicates
const processingRequests = new Map();

// Function to check if an image is at least 300px in both dimensions and resize if needed
async function ensureMinimumImageSize(imageUrl) {
  try {
    let imageBuffer;
    let contentType;
    
    // If it's a URL, fetch the image
    if (imageUrl.startsWith('http')) {
      const response = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000 // 10 second timeout
      });
      imageBuffer = response.data;
      contentType = response.headers['content-type'];
    } 
    // If it's a base64 data URL, extract the data
    else if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contentType = matches[1];
        const base64Data = matches[2];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        throw new Error('Invalid base64 image format');
      }
    } else {
      throw new Error('Unsupported image format');
    }
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    
    // Check if image needs resizing
    if (metadata.width < 300 || metadata.height < 300) {
      console.log(`Image too small (${metadata.width}x${metadata.height}), resizing to minimum 300px`);
      
      // Calculate new dimensions (maintaining aspect ratio)
      const aspectRatio = metadata.width / metadata.height;
      let newWidth = metadata.width;
      let newHeight = metadata.height;
      
      if (metadata.width < 300) {
        newWidth = 300;
        newHeight = Math.round(newWidth / aspectRatio);
      }
      
      if (newHeight < 300) {
        newHeight = 300;
        newWidth = Math.round(newHeight * aspectRatio);
      }
      
      // Resize the image and convert to PNG
      const resizedBuffer = await sharp(imageBuffer)
        .resize(newWidth, newHeight)
        .toFormat('png')
        .toBuffer();
      
      // Upload the resized image to ImgBB
      const base64Data = resizedBuffer.toString('base64');
      const uploadResult = await uploadBase64Image(base64Data);
      return uploadResult.display_url || uploadResult.url;
    }
    
    // If image is already large enough, return the original URL
    return imageUrl;
  } catch (error) {
    console.error('Error ensuring minimum image size:', error);
    return imageUrl; // Return original URL if there's an error
  }
}

export async function POST(request) {
  try {
    const requestBody = await request.json();
    
    // Validate request body
    if (!requestBody.image_url) {
      return NextResponse.json(
        { error: 'Result image is required' },
        { status: 400 }
      );
    }

    // Generate a request ID based on the image URL
    const requestId = typeof requestBody.image_url === 'string' 
      ? requestBody.image_url.substring(0, 100) // Use part of the URL as ID
      : Date.now().toString(); // Fallback to timestamp
    
    // Check if this request is already being processed
    if (processingRequests.has(requestId)) {
      console.log('Request already being processed, returning status:', processingRequests.get(requestId));
      return NextResponse.json({
        status: 'processing',
        message: 'Your video is still being generated. Please wait.'
      });
    }
    
    // Mark this request as processing
    processingRequests.set(requestId, 'processing');

    // Get webhook URL from environment variables
    const n8nVideoWebhookUrl = process.env.N8N_VIDEO_WEBHOOK_URL || 'https://n8n.lolinux2002.com/webhook/outfit-try-on-video';
    
    // Process the image to ensure it's at least 300px and convert to PNG
    let imageUrl = requestBody.image_url;
    
    try {
      console.log('Checking image dimensions and converting to PNG...');
      imageUrl = await ensureMinimumImageSize(imageUrl);
      console.log('Image processed successfully:', imageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      // Continue with the original image if processing fails
    }
    
    console.log('Sending image to n8n video webhook:', {
      url: n8nVideoWebhookUrl,
      isBase64: imageUrl.startsWith('data:image'),
      isUrl: imageUrl.startsWith('http')
    });

    try {
      // Send data to n8n webhook with a 10-minute timeout
      const response = await axios.post(
        n8nVideoWebhookUrl,
        { image_url: imageUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'video/mp4, application/json'
          },
          timeout: 600000, // 10 minutes timeout
          responseType: 'arraybuffer' // Handle binary response (video file)
        }
      );

      // Check if the response is a video
      const contentType = response.headers['content-type'];
      console.log('n8n video webhook response content type:', contentType);

      // First, try to parse as JSON to check for resource_without_watermark
      try {
        const textData = Buffer.from(response.data).toString('utf-8');
        const jsonData = JSON.parse(textData);
        
        console.log('Received JSON response from n8n webhook:', jsonData);
        
        // Check if the response contains resource_without_watermark
        if (jsonData.resource_without_watermark) {
          console.log('Found resource_without_watermark URL:', jsonData.resource_without_watermark);
          
          // Remove from processing map
          processingRequests.delete(requestId);
          
          // Return the video URL directly
          return NextResponse.json({
            result_video_url: jsonData.resource_without_watermark,
            message: 'Successfully generated video'
          });
        }
        
        // If we have any other video URL in the response
        if (jsonData.video_url || jsonData.url || jsonData.result_url) {
          const videoUrl = jsonData.video_url || jsonData.url || jsonData.result_url;
          console.log('Found video URL in response:', videoUrl);
          
          // Remove from processing map
          processingRequests.delete(requestId);
          
          return NextResponse.json({
            result_video_url: videoUrl,
            message: 'Successfully generated video'
          });
        }
        
        // If no video URL found, return the JSON response
        processingRequests.delete(requestId);
        return NextResponse.json(jsonData);
        
      } catch (parseError) {
        // Not valid JSON, check if it's a binary video response
        if (contentType && (contentType.includes('video/mp4') || contentType.includes('video/'))) {
          // Convert the binary data to base64
          const base64Video = Buffer.from(response.data, 'binary').toString('base64');
          const dataUrl = `data:${contentType};base64,${base64Video}`;
          
          console.log('Received binary video from n8n webhook');
          
          // Remove from processing map
          processingRequests.delete(requestId);
          
          // Return the video as a data URL
          return NextResponse.json({
            result_video_url: dataUrl,
            message: 'Successfully generated video'
          });
        } else {
          console.error('Error parsing response and not a video content type:', contentType);
          
          // Remove from processing map
          processingRequests.delete(requestId);
          
          throw new Error('Unexpected response format from n8n webhook');
        }
      }
    } catch (axiosError) {
      // If we get a 524 Gateway Timeout, the n8n process might still be running
      if (axiosError.response && axiosError.response.status === 524) {
        console.log('Received 524 Gateway Timeout, n8n process might still be running');
        
        // Keep the request in the processing map
        // It will be checked again by the client's polling mechanism
        
        return NextResponse.json(
          { 
            error: 'Request failed with status code 524',
            details: 'The video generation is taking longer than expected. Please wait or try again later.',
            status: 'processing'
          },
          { status: 524 }
        );
      }
      
      // For other errors, remove from processing map and throw
      processingRequests.delete(requestId);
      throw axiosError;
    }
  } catch (error) {
    console.error('Error processing video with n8n:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data ? 'Binary data' : null,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate video with n8n',
        details: 'The request to the n8n webhook timed out or failed'
      },
      { status: error.response?.status || 500 }
    );
  }
} 