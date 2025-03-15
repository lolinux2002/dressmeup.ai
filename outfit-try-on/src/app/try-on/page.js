'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { isValidImageType, convertToPNG } from '../utils/imageUtils';

export default function TryOnPage() {
  const [userImage, setUserImage] = useState(null);
  const [upperOutfitImage, setUpperOutfitImage] = useState(null);
  const [lowerOutfitImage, setLowerOutfitImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultVideo, setResultVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [videoTaskStatus, setVideoTaskStatus] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [upperOutfitImageFile, setUpperOutfitImageFile] = useState(null);
  const [lowerOutfitImageFile, setLowerOutfitImageFile] = useState(null);

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
    const file = acceptedFiles[0];
    if (file) {
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

  const onUpperOutfitImageDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const processedFile = await validateAndProcessImage(file);
        setUpperOutfitImageFile(processedFile);
        setUpperOutfitImage(URL.createObjectURL(processedFile));
        setError(null);
      } catch (error) {
        setError(error.message);
        setUpperOutfitImageFile(null);
        setUpperOutfitImage(null);
      }
    }
  };

  const onLowerOutfitImageDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const processedFile = await validateAndProcessImage(file);
        setLowerOutfitImageFile(processedFile);
        setLowerOutfitImage(URL.createObjectURL(processedFile));
        setError(null);
      } catch (error) {
        setError(error.message);
        setLowerOutfitImageFile(null);
        setLowerOutfitImage(null);
      }
    }
  };

  const { getRootProps: getUserRootProps, getInputProps: getUserInputProps } = useDropzone({
    onDrop: onUserImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const { getRootProps: getUpperOutfitRootProps, getInputProps: getUpperOutfitInputProps } = useDropzone({
    onDrop: onUpperOutfitImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const { getRootProps: getLowerOutfitRootProps, getInputProps: getLowerOutfitInputProps } = useDropzone({
    onDrop: onLowerOutfitImageDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const checkTaskStatus = async (taskId) => {
    try {
      const response = await axios.get(`/api/task-status?taskId=${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking task status:', error);
      throw error;
    }
  };

  const pollTaskStatus = async (taskId) => {
    const maxAttempts = 30; // 30 seconds maximum
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await checkTaskStatus(taskId);
        setTaskStatus(status);

        if (status.status === 'completed') {
          setResultImage(status.result_url);
          setLoading(false);
          return;
        } else if (status.status === 'failed') {
          setError('Image processing failed. Please try again.');
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000); // Poll every second
        } else {
          setError('Request timed out. Please try again.');
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to check task status. Please try again.');
        setLoading(false);
      }
    };

    poll();
  };

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

    if (!upperOutfitImageFile && !lowerOutfitImageFile) {
      setError('Please upload at least one outfit piece (upper or lower)');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);
    setResultVideo(null);
    setTaskId(null);
    setTaskStatus({ status: 'uploading', progress: 0 });
    setVideoTaskStatus(null);
    setVideoError(null);

    try {
      // Upload user image and outfit images
      const uploadPromises = [uploadImage(userImageFile)];
      if (upperOutfitImageFile) uploadPromises.push(uploadImage(upperOutfitImageFile));
      if (lowerOutfitImageFile) uploadPromises.push(uploadImage(lowerOutfitImageFile));

      setTaskStatus({ status: 'uploading', progress: 20 });
      const [userImageUrl, ...outfitUrls] = await Promise.all(uploadPromises);
      setTaskStatus({ status: 'uploading', progress: 50 });

      console.log('Uploaded images:', {
        userImage: userImageUrl,
        upperOutfit: upperOutfitImageFile ? outfitUrls[0] : null,
        lowerOutfit: lowerOutfitImageFile ? outfitUrls[1] : null
      });

      // Prepare the request body for n8n
      const requestBody = {
        model_input: userImageUrl,
        upper_input: upperOutfitImageFile ? outfitUrls[0] : null,
        lower_input: lowerOutfitImageFile ? outfitUrls[1] : null
      };

      console.log('Sending to n8n:', requestBody);
      setTaskStatus({ status: 'processing', progress: 70 });

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
      setTaskStatus({ status: 'processing', progress: 90 });

      // Check if the response contains a result image URL
      if (response.data && response.data.result_image_url) {
        // Preload the image to ensure it's available
        const img = document.createElement('img');
        img.onload = () => {
          console.log('Result image loaded successfully');
          setResultImage(response.data.result_image_url);
          setTaskStatus({ status: 'completed', progress: 100 });
          setLoading(false);
        };
        img.onerror = () => {
          console.error('Failed to load result image');
          setError('Failed to load the result image. Please try again.');
          setTaskStatus({ status: 'failed', progress: 0 });
          setLoading(false);
        };
        img.src = response.data.result_image_url;
      } else {
        throw new Error('No result image received from n8n');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to process images');
      setTaskStatus({ status: 'failed', progress: 0 });
      setLoading(false);
    }
  };

  const handleMakeVideo = async () => {
    if (!resultImage) {
      setVideoError('No result image available. Please try on an outfit first.');
      return;
    }

    setVideoLoading(true);
    setVideoError(null);
    setResultVideo(null);
    setVideoTaskStatus({ status: 'processing', progress: 0 });

    try {
      // Prepare the request body for n8n video webhook
      // The image will be automatically uploaded to ImgBB by the API endpoint
      // before being sent to the video generation webhook
      const requestBody = {
        image_url: resultImage
      };

      console.log('Sending image to video webhook:', requestBody);
      setVideoTaskStatus({ status: 'processing', progress: 30 });

      // Set up a timeout for the n8n request (10 minutes)
      const timeoutDuration = 600000; // 10 minutes in milliseconds
      
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request to video webhook timed out after 10 minutes. Please try again.'));
        }, timeoutDuration);
      });
      
      // Race the actual request against the timeout
      const response = await Promise.race([
        axios.post('/api/n8n-video', requestBody),
        timeoutPromise
      ]);

      console.log('Video webhook response received:', response.data);
      setVideoTaskStatus({ status: 'processing', progress: 70 });

      // Check if the response contains a result video URL
      if (response.data && response.data.result_video_url) {
        console.log('Result video URL received:', response.data.result_video_url);
        
        // Preload the video to ensure it's available
        const videoUrl = response.data.result_video_url;
        
        // If it's a URL (not a data URL), set it directly
        if (videoUrl.startsWith('http')) {
          setResultVideo(videoUrl);
          setVideoTaskStatus({ status: 'completed', progress: 100 });
          setVideoLoading(false);
        } else {
          // For data URLs, preload the video
          const video = document.createElement('video');
          video.onloadeddata = () => {
            console.log('Video loaded successfully');
            setResultVideo(videoUrl);
            setVideoTaskStatus({ status: 'completed', progress: 100 });
            setVideoLoading(false);
          };
          video.onerror = () => {
            console.error('Failed to load video');
            setVideoError('Failed to load the video. Please try again.');
            setVideoTaskStatus({ status: 'failed', progress: 0 });
            setVideoLoading(false);
          };
          video.src = videoUrl;
        }
      } else {
        throw new Error('No result video received from webhook');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      
      // Check if it's a 524 Gateway Timeout error
      if (error.message?.includes('status code 524') || 
          (error.response && error.response.status === 524)) {
        console.log('Received 524 error, n8n automation might still be running');
        
        // Show a special message for this case
        setVideoTaskStatus({ 
          status: 'processing', 
          progress: 50,
          message: 'The video is taking longer than expected to generate. We\'ll keep checking for it.'
        });
        
        // Start polling for the result
        pollForVideoResult(requestBody);
      } else {
        // Handle other errors normally
        const errorMessage = error.response?.data?.error || error.message || 'Failed to generate video';
        setVideoError(errorMessage);
        setVideoTaskStatus({ status: 'failed', progress: 0 });
        setVideoLoading(false);
      }
    }
  };

  // Function to poll for video result after a 524 error
  const pollForVideoResult = async (requestBody) => {
    let attempts = 0;
    const maxAttempts = 20; // Try up to 20 times
    const pollInterval = 30000; // 30 seconds between attempts
    
    const checkForVideo = async () => {
      attempts++;
      try {
        console.log(`Polling for video result (attempt ${attempts}/${maxAttempts})...`);
        setVideoTaskStatus({ 
          status: 'processing', 
          progress: 50 + Math.min(attempts * 2, 40), // Progress from 50% to 90%
          message: `Still generating your video... (attempt ${attempts}/${maxAttempts})`
        });
        
        const response = await axios.post('/api/n8n-video', requestBody);
        console.log(`Polling attempt ${attempts} response:`, response.data);
        
        if (response.data && response.data.result_video_url) {
          console.log('Successfully received video on retry:', response.data.result_video_url);
          
          // If it's a URL (not a data URL), set it directly
          const videoUrl = response.data.result_video_url;
          if (videoUrl.startsWith('http')) {
            setResultVideo(videoUrl);
            setVideoTaskStatus({ status: 'completed', progress: 100 });
            setVideoLoading(false);
            return true;
          } else {
            // For data URLs, preload the video
            const video = document.createElement('video');
            
            // Create a promise to handle video loading
            const videoLoaded = new Promise((resolve, reject) => {
              video.onloadeddata = () => {
                console.log('Video loaded successfully on retry');
                resolve(true);
              };
              video.onerror = () => {
                console.error('Failed to load video on retry');
                reject(new Error('Failed to load the video'));
              };
              // Set a timeout in case the video never loads
              setTimeout(() => reject(new Error('Video loading timed out')), 30000);
            });
            
            // Set the video source
            video.src = videoUrl;
            
            try {
              await videoLoaded;
              setResultVideo(videoUrl);
              setVideoTaskStatus({ status: 'completed', progress: 100 });
              setVideoLoading(false);
              return true;
            } catch (videoError) {
              console.error('Video loading error:', videoError);
              throw videoError;
            }
          }
        }
        
        // If we have a processing status, continue polling
        if (response.data && response.data.status === 'processing') {
          console.log('Video is still processing, will continue polling');
        }
      } catch (pollError) {
        console.error(`Polling attempt ${attempts} failed:`, pollError);
        
        // If we get another 524, continue polling
        if (pollError.message?.includes('status code 524') || 
            (pollError.response && pollError.response.status === 524)) {
          console.log('Still getting 524, will continue polling');
        } else if (attempts >= maxAttempts) {
          // If we've reached max attempts, show error
          setVideoError('Video generation is taking too long. Please try again later.');
          setVideoTaskStatus({ status: 'failed', progress: 0 });
          setVideoLoading(false);
          return true;
        }
      }
      
      // If we haven't returned yet and haven't reached max attempts, schedule another check
      if (attempts < maxAttempts) {
        setTimeout(checkForVideo, pollInterval);
        return false;
      } else {
        setVideoError('Video generation timed out after multiple attempts. Please try again.');
        setVideoTaskStatus({ status: 'failed', progress: 0 });
        setVideoLoading(false);
        return true;
      }
    };
    
    // Start the polling process
    checkForVideo();
  };

  return (
    <div className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Outfit Try-On
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Upload your photo and outfit pieces to see how they look on you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Image Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Upload Your Photo</h2>
            <div
              {...getUserRootProps()}
              className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors bg-white shadow-sm hover:shadow-md"
            >
              <input {...getUserInputProps()} />
              {userImage ? (
                <img src={userImage} alt="User" className="max-h-64 mx-auto rounded-lg shadow-sm" />
              ) : (
                <p className="text-indigo-600">Drag & drop your photo here, or click to select</p>
              )}
            </div>
          </div>

          {/* Outfit Images Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-700">Upload Outfit Pieces</h2>
            
            {/* Upper Outfit Upload */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-indigo-600">Upper Body (Optional)</h3>
              <div
                {...getUpperOutfitRootProps()}
                className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors bg-white shadow-sm hover:shadow-md"
              >
                <input {...getUpperOutfitInputProps()} />
                {upperOutfitImage ? (
                  <img src={upperOutfitImage} alt="Upper Outfit" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                ) : (
                  <p className="text-indigo-600">Upload top/shirt/jacket</p>
                )}
              </div>
            </div>

            {/* Lower Outfit Upload */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-indigo-600">Lower Body (Optional)</h3>
              <div
                {...getLowerOutfitRootProps()}
                className="border-2 border-dashed border-indigo-200 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors bg-white shadow-sm hover:shadow-md"
              >
                <input {...getLowerOutfitInputProps()} />
                {lowerOutfitImage ? (
                  <img src={lowerOutfitImage} alt="Lower Outfit" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                ) : (
                  <p className="text-indigo-600">Upload pants/skirt/shorts</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Try On Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleTryOn}
            disabled={loading || !userImageFile || (!upperOutfitImageFile && !lowerOutfitImageFile)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Try On Outfit'}
          </button>
        </div>

        {/* Task Status with Progress Bar */}
        {taskStatus && (
          <div className="text-center mb-8">
            <p className="text-indigo-700 mb-2 font-medium">
              Status: {taskStatus.status === 'uploading' ? 'Uploading your images...' :
                     taskStatus.status === 'processing' ? 'Processing your images with AI...' : 
                     taskStatus.status === 'completed' ? 'Completed!' : 
                     taskStatus.status === 'failed' ? 'Failed' : 'Unknown'}
            </p>
            {(taskStatus.status === 'uploading' || taskStatus.status === 'processing') && (
              <div className="w-full bg-indigo-100 rounded-full h-3 shadow-inner mb-6">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${taskStatus.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Error Message with Retry Button */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 shadow-sm">
            <p className="mb-2">{error}</p>
            <button 
              onClick={handleTryOn}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result Image */}
        {resultImage && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-indigo-800">Result</h2>
            <div className="border border-indigo-100 rounded-lg p-4 bg-white shadow-lg">
              <img 
                src={resultImage} 
                alt="Try-on Result" 
                className="max-h-96 mx-auto rounded-lg"
              />
              <p className="text-center mt-4 text-indigo-600 text-sm">
                AI-generated outfit try-on result
              </p>
              <div className="flex justify-center mt-4 space-x-4">
                <a 
                  href={resultImage} 
                  download="outfit-try-on-result.png"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Download Image
                </a>
                <button
                  onClick={handleMakeVideo}
                  disabled={videoLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {videoLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Make a Video'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Task Status with Progress Bar */}
        {videoTaskStatus && !resultVideo && (
          <div className="text-center my-8">
            <p className="text-indigo-700 mb-2 font-medium">
              Status: {videoTaskStatus.status === 'processing' ? 'Generating your video with AI...' : 
                     videoTaskStatus.status === 'completed' ? 'Completed!' : 
                     videoTaskStatus.status === 'failed' ? 'Failed' : 'Unknown'}
            </p>
            {videoTaskStatus.message && (
              <p className="text-indigo-600 mb-2 text-sm">{videoTaskStatus.message}</p>
            )}
            {(videoTaskStatus.status === 'processing') && (
              <div className="w-full bg-indigo-100 rounded-full h-3 shadow-inner mb-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${videoTaskStatus.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Video Error Message with Retry Button */}
        {videoError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg my-8 shadow-sm text-center">
            <p className="mb-2">{videoError}</p>
            <button 
              onClick={handleMakeVideo}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 524 Gateway Timeout Error */}
        {videoError && videoError.includes('status code 524') && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h3 className="text-xl font-bold text-amber-600 mb-4">Video Generation In Progress</h3>
              <p className="text-gray-700 mb-6">
                The video is taking longer than expected to generate. The system will continue checking for your video.
                Please wait or try again later.
              </p>
              <button 
                onClick={() => {
                  setVideoError(null);
                  handleMakeVideo();
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Unexpected Response Format Error */}
        {videoError === 'Unexpected response format from n8n webhook' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h3 className="text-xl font-bold text-red-600 mb-4">Unexpected response format from n8n webhook</h3>
              <p className="text-gray-700 mb-6">The video generation service returned an unexpected response. Please try again.</p>
              <button 
                onClick={() => {
                  setVideoError(null);
                  handleMakeVideo();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Result Video */}
        {resultVideo && (
          <div className="space-y-4 my-8">
            <h2 className="text-xl font-semibold text-center text-indigo-800">Your Video</h2>
            <div className="border border-indigo-100 rounded-lg p-4 bg-white shadow-lg">
              <video 
                src={resultVideo} 
                controls
                autoPlay
                loop
                className="max-h-96 max-w-full mx-auto rounded-lg"
                playsInline
                onError={(e) => {
                  console.error('Video playback error:', e);
                  setVideoError('Error playing the video. Please try downloading it instead.');
                }}
              />
              <p className="text-center mt-4 text-indigo-600 text-sm">
                AI-generated outfit try-on video
              </p>
              <div className="flex justify-center mt-4">
                <a 
                  href={resultVideo} 
                  download="outfit-try-on-video.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Download Video
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 