'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import axios from 'axios';
import { isValidImageType, convertToPNG } from '../utils/imageUtils';

export default function TryOnSection() {
  const [userImage, setUserImage] = useState(null);
  const [outfitImage, setOutfitImage] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [outfitImageFile, setOutfitImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const validateAndProcessImage = async (file) => {
    try {
      // First check if it's a valid image type
      const isValid = await isValidImageType(file);
      if (!isValid) {
        throw new Error('Invalid image format. Please upload a valid JPG or PNG image.');
      }

      // Convert to PNG if it's not already
      const processedFile = await convertToPNG(file);
      return processedFile;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const onUserImageDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const processedFile = await validateAndProcessImage(file);
        setUserImageFile(processedFile);
        setUserImage(URL.createObjectURL(processedFile));
        setError(null);
      } catch (error) {
        setError(error.message);
        setUserImageFile(null);
        setUserImage(null);
      }
    }
  };

  const onOutfitImageDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const processedFile = await validateAndProcessImage(file);
        setOutfitImageFile(processedFile);
        setOutfitImage(URL.createObjectURL(processedFile));
        setError(null);
      } catch (error) {
        setError(error.message);
        setOutfitImageFile(null);
        setOutfitImage(null);
      }
    }
  };

  const { getRootProps: getUserRootProps, getInputProps: getUserInputProps } = useDropzone({
    onDrop: onUserImageDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1
  });

  const { getRootProps: getOutfitRootProps, getInputProps: getOutfitInputProps } = useDropzone({
    onDrop: onOutfitImageDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1
  });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Use the display_url for better quality
      return response.data.display_url || response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to upload image');
    }
  };

  const handleTryOn = async () => {
    if (!userImageFile) {
      setError('Please upload your photo first');
      return;
    }

    if (!outfitImageFile) {
      setError('Please upload an outfit to try on');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      // Upload user image and outfit images
      const [userImageUrl, outfitImageUrl] = await Promise.all([
        uploadImage(userImageFile),
        uploadImage(outfitImageFile)
      ]);

      console.log('Uploaded images:', {
        userImage: userImageUrl,
        outfitImage: outfitImageUrl
      });

      // Prepare the request body for n8n
      const requestBody = {
        model_input: userImageUrl,
        upper_input: outfitImageUrl,
        lower_input: null
      };

      console.log('Sending to n8n:', requestBody);

      // Set up a timeout for the n8n request (2 minutes)
      const timeoutDuration = 120000; // 2 minutes in milliseconds
      
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request to n8n timed out after 2 minutes. Please try again.'));
        }, timeoutDuration);
      });
      
      // Race the actual request against the timeout
      const response = await Promise.race([
        axios.post('/api/n8n-process', requestBody),
        timeoutPromise
      ]);

      console.log('n8n response received');

      // Check if the response contains a result image URL
      if (response.data && response.data.result_image_url) {
        // Preload the image to ensure it's available
        const img = document.createElement('img');
        img.onload = () => {
          console.log('Result image loaded successfully');
          setResultImage(response.data.result_image_url);
          setLoading(false);
        };
        img.onerror = () => {
          console.error('Failed to load result image');
          setError('Failed to load the result image. Please try again.');
          setLoading(false);
        };
        img.src = response.data.result_image_url;
      } else {
        throw new Error('No result image received from n8n');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to process images');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Try On Outfits Now
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Upload your photo and an outfit to see how it looks on you
          </p>
        </div>

        {error && (
          <div className="mt-6 mx-auto max-w-3xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <p>{error}</p>
          </div>
        )}

        {resultImage ? (
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 text-center mb-4">Your Result</h3>
                <img src={resultImage} alt="Try-on Result" className="max-h-96 mx-auto rounded-lg" />
                <div className="mt-6 flex justify-center space-x-4">
                  <a 
                    href={resultImage} 
                    download="outfit-try-on-result.png"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Download Image
                  </a>
                  <button
                    onClick={() => {
                      setResultImage(null);
                      setUserImage(null);
                      setOutfitImage(null);
                      setUserImageFile(null);
                      setOutfitImageFile(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Try Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* User Image Upload */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Upload Your Photo</h3>
                  <div className="mt-4">
                    <div 
                      {...getUserRootProps()} 
                      className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${userImage ? 'border-indigo-500' : ''}`}
                    >
                      <div className="space-y-1 text-center">
                        <input {...getUserInputProps()} />
                        {!userImage ? (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <p className="pl-1">Drag and drop your photo or click to browse</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </>
                        ) : (
                          <div className="relative h-64 w-full">
                            <img src={userImage} alt="User" className="h-full w-full object-cover" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserImage(null);
                                setUserImageFile(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outfit Image Upload */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Upload Outfit</h3>
                  <div className="mt-4">
                    <div 
                      {...getOutfitRootProps()} 
                      className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${outfitImage ? 'border-indigo-500' : ''}`}
                    >
                      <div className="space-y-1 text-center">
                        <input {...getOutfitInputProps()} />
                        {!outfitImage ? (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <p className="pl-1">Drag and drop an outfit or click to browse</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                          </>
                        ) : (
                          <div className="relative h-64 w-full">
                            <img src={outfitImage} alt="Outfit" className="h-full w-full object-cover" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOutfitImage(null);
                                setOutfitImageFile(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              {loading ? (
                <button
                  disabled
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-400 cursor-not-allowed"
                >
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </button>
              ) : (
                <button 
                  onClick={handleTryOn}
                  disabled={!userImage || !outfitImage}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 ${(!userImage || !outfitImage) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Try On Outfit
                </button>
              )}
            </div>
          </>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Want more options? <Link href="/try-on" className="text-indigo-600 hover:text-indigo-500">Go to the full try-on page</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 