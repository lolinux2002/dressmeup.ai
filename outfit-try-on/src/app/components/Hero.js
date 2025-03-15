'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-blue-950 overflow-hidden">
      {/* Background pattern */}
      <div className="hidden sm:block sm:absolute sm:inset-0">
        <svg 
          className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48 text-indigo-700 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0" 
          width="404" 
          height="404" 
          fill="none" 
          viewBox="0 0 404 404" 
          aria-hidden="true"
        >
          <defs>
            <pattern 
              id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d" 
              x="0" 
              y="0" 
              width="20" 
              height="20" 
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-indigo-500" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)" />
        </svg>
      </div>
      
      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-7xl">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-5 lg:text-left lg:flex lg:items-center">
                <div>
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block">Virtual Fashion</span>
                    <span className="block text-indigo-400">Try-On Experience</span>
                  </h1>
                  <p className="mt-3 text-xl text-white font-semibold sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
                    <span className="bg-indigo-600 px-2 py-1 rounded">Revolutionary AI Technology</span>
                  </p>
                  <p className="mt-4 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    <strong className="text-white">Upload your photo and try on different outfits instantly</strong> with our 
                    AI-powered technology. See how clothes look on you before you buy them.
                  </p>
                  <div className="mt-8 sm:mt-12">
                    <Link href="/dressmeup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50 sm:px-8">
                      Try It Now
                    </Link>
                    <Link href="/pricing" className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8">
                      View Pricing
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-7">
                <div className="bg-white sm:max-w-lg sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                  <div className="px-4 py-8 sm:px-10">
                    <div className="mt-6">
                      <div className="mt-6 relative">
                        <div className="relative h-80 overflow-hidden rounded-lg">
                          {/* Hero image - using your custom image */}
                          <div className="absolute inset-0">
                            <Image 
                              src="/images/dressmeup_hero.png" 
                              alt="DressMe Up Example"
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('bg-gray-100');
                                e.target.parentElement.innerHTML = `
                                  <div class="flex flex-col items-center justify-center h-full text-gray-500">
                                    <svg class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Place your hero image in /images/dressmeup_hero.png</span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 