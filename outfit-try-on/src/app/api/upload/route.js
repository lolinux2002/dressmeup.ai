import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Log file details for debugging
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Create a new FormData instance for the upload
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    // Upload to ImgBB
    const uploadUrl = 'https://api.imgbb.com/1/upload';
    const uploadKey = process.env.IMGBB_API_KEY;

    if (!uploadKey) {
      console.error('Missing IMGBB_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Image upload service configuration is missing' },
        { status: 500 }
      );
    }

    console.log('Uploading to ImgBB...');
    const response = await axios.post(
      `${uploadUrl}?key=${uploadKey}`,
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('ImgBB response:', {
      success: response.data?.success,
      status: response.data?.status,
      hasUrl: !!response.data?.data?.url
    });

    if (response.data?.success && response.data?.status === 200 && response.data?.data?.url) {
      // Clean the URLs to ensure they're valid
      const url = response.data.data.url.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]/g, '');
      const displayUrl = response.data.data.display_url?.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]/g, '');
      const deleteUrl = response.data.data.delete_url?.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]/g, '');

      return NextResponse.json({
        url,
        display_url: displayUrl,
        delete_url: deleteUrl
      });
    } else {
      console.error('ImgBB upload failed:', response.data);
      throw new Error(response.data?.data?.error?.message || 'Failed to upload image to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading image:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: error.response?.data?.error?.message || error.message || 'Failed to upload image',
        details: error.response?.data?.error?.raw_message || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Helper function to upload a base64 image to ImgBB
export async function uploadBase64Image(base64Image) {
  try {
    // Remove the data:image/png;base64, prefix if present
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    // Upload to ImgBB
    const uploadUrl = 'https://api.imgbb.com/1/upload';
    const uploadKey = process.env.IMGBB_API_KEY;

    if (!uploadKey) {
      console.error('Missing IMGBB_API_KEY environment variable');
      throw new Error('Image upload service configuration is missing');
    }

    console.log('Uploading base64 image to ImgBB...');
    const response = await axios.post(
      `${uploadUrl}?key=${uploadKey}`,
      {
        image: base64Data
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('ImgBB response for base64 upload:', {
      success: response.data?.success,
      status: response.data?.status,
      hasUrl: !!response.data?.data?.url
    });

    if (response.data?.success && response.data?.status === 200 && response.data?.data?.url) {
      // Clean the URLs to ensure they're valid
      const url = response.data.data.url.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]/g, '');
      const displayUrl = response.data.data.display_url?.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]/g, '');
      
      return {
        url,
        display_url: displayUrl
      };
    } else {
      console.error('ImgBB base64 upload failed:', response.data);
      throw new Error(response.data?.data?.error?.message || 'Failed to upload base64 image to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading base64 image:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    throw error;
  }
} 