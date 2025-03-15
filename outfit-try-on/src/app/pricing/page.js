'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  
  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out our service',
      features: [
        '5 image generations per month',
        '2 video generations per month',
        'Standard resolution output',
        'Basic customer support',
        'Access to standard models only'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'For individuals who need more power',
      features: [
        '50 image generations per month',
        '20 video generations per month',
        'HD resolution output',
        'Priority customer support',
        'Access to premium models',
        'Download history for 30 days'
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'solid',
      popular: true
    },
    {
      name: 'Business',
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'For teams and businesses',
      features: [
        'Unlimited image generations',
        '100 video generations per month',
        '4K resolution output',
        '24/7 dedicated support',
        'Access to all models including beta',
        'API access',
        'Download history for 1 year',
        'Custom branding options'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false
    }
  ];

  const additionalCredits = [
    { name: '10 Image Credits', price: 4.99, description: 'Generate 10 additional outfit images' },
    { name: '50 Image Credits', price: 19.99, description: 'Generate 50 additional outfit images' },
    { name: '5 Video Credits', price: 9.99, description: 'Generate 5 additional outfit videos' },
    { name: '20 Video Credits', price: 29.99, description: 'Generate 20 additional outfit videos' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect plan for your fashion visualization needs
          </p>
        </div>

        {/* Billing period toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative bg-white rounded-lg p-1 flex">
            <button
              type="button"
              className={`${
                billingPeriod === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500'
              } relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`${
                billingPeriod === 'yearly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500'
              } ml-0.5 relative py-2 px-6 border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing plans */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 text-xs font-medium tracking-tight text-white bg-indigo-600 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${plan.price[billingPeriod]}
                  </span>
                  <span className="ml-1 text-xl font-semibold">
                    {billingPeriod === 'monthly' ? '/month' : '/year'}
                  </span>
                </p>
                <p className="mt-6 text-gray-500">{plan.description}</p>

                {/* Feature list */}
                <ul role="list" className="mt-6 space-y-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg
                        className="flex-shrink-0 w-6 h-6 text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#"
                className={`mt-8 block w-full py-3 px-6 border ${
                  plan.buttonVariant === 'outline'
                    ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                } rounded-md text-center font-medium`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Additional credits */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Need more credits?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-center text-xl text-gray-500">
            Purchase additional credits anytime without changing your subscription
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {additionalCredits.map((credit) => (
              <div
                key={credit.name}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-6 py-5">
                  <h3 className="text-lg font-medium text-gray-900">{credit.name}</h3>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">${credit.price}</p>
                  <p className="mt-3 text-sm text-gray-500">{credit.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50">
                  <a
                    href="#"
                    className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Purchase credits
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200">
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">
                What happens when I run out of credits?
              </h3>
              <div className="mt-2 text-base text-gray-500">
                <p>
                  When you run out of credits, you can purchase additional credit packs or upgrade
                  your subscription. Your account will remain active, but you won't be able to
                  generate new images or videos until you have available credits.
                </p>
              </div>
            </div>
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">
                Do unused credits roll over to the next month?
              </h3>
              <div className="mt-2 text-base text-gray-500">
                <p>
                  Yes, unused credits from your monthly subscription roll over for up to 3 months.
                  Purchased credit packs never expire and remain in your account until used.
                </p>
              </div>
            </div>
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">
                Can I upgrade or downgrade my plan?
              </h3>
              <div className="mt-2 text-base text-gray-500">
                <p>
                  Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be
                  charged the prorated difference. When downgrading, your new plan will take effect
                  at the start of your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 