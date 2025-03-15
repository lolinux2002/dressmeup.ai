'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                {/* Logo image - using your custom logo with larger size */}
                <div className="relative w-40 h-12">
                  <Image 
                    src="/images/dressmeup_logo.jpeg" 
                    alt="DressMe Up Logo"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z'%3E%3C/path%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'border-indigo-500 text-black' 
                    : 'border-transparent text-black hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/dressmeup" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/dressmeup') 
                    ? 'border-indigo-500 text-black' 
                    : 'border-transparent text-black hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                DressMe Up
              </Link>
              <Link 
                href="/pricing" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/pricing') 
                    ? 'border-indigo-500 text-black' 
                    : 'border-transparent text-black hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                Pricing
              </Link>
              <Link 
                href="/help" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/help') 
                    ? 'border-indigo-500 text-black' 
                    : 'border-transparent text-black hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                Help
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link 
                href="/login?tab=signup" 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'border-indigo-500 text-black bg-indigo-50' 
                  : 'border-transparent text-black hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/dressmeup" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                isActive('/dressmeup') 
                  ? 'border-indigo-500 text-black bg-indigo-50' 
                  : 'border-transparent text-black hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              DressMe Up
            </Link>
            <Link 
              href="/pricing" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                isActive('/pricing') 
                  ? 'border-indigo-500 text-black bg-indigo-50' 
                  : 'border-transparent text-black hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/help" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                isActive('/help') 
                  ? 'border-indigo-500 text-black bg-indigo-50' 
                  : 'border-transparent text-black hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              Help
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link 
                href="/login" 
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Log in
              </Link>
              <Link 
                href="/login?tab=signup" 
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 