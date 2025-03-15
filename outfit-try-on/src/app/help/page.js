'use client';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How does the outfit try-on feature work?',
      answer: 'Our outfit try-on feature uses advanced AI technology to digitally place clothing items onto your photo. Simply upload a clear photo of yourself and the outfit pieces you want to try on, then our AI will process the images and show you how the outfit would look on you.'
    },
    {
      question: 'What types of images should I upload?',
      answer: 'For the best results, upload a clear, well-lit photo of yourself standing in a neutral pose against a simple background. For outfit pieces, use images with the clothing item clearly visible against a white or transparent background.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We currently support JPEG and PNG image formats. All images are automatically processed to ensure compatibility with our AI system.'
    },
    {
      question: 'Is there a limit to how many outfits I can try on?',
      answer: 'There is no limit to how many different outfits you can try on. You can upload as many different outfit pieces as you like and see how each looks on your photo.'
    },
    {
      question: 'How accurate are the try-on results?',
      answer: 'While our AI technology provides a good representation of how clothes might look on you, the results are simulations and may not perfectly match how the actual clothing items would fit in real life. Factors like exact sizing, fabric drape, and personal fit preferences may vary.'
    },
    {
      question: 'Can I save or share my try-on results?',
      answer: 'Yes! After processing, you can download your try-on image or even create a short video animation. You can save these to your device or share them directly on social media.'
    },
    {
      question: 'Is my data secure?',
      answer: 'We take your privacy seriously. Your uploaded images are processed securely and are not shared with third parties. Images are temporarily stored only for the purpose of processing your try-on request and are automatically deleted afterward.'
    },
    {
      question: 'What should I do if I encounter an error?',
      answer: 'If you encounter an error during the try-on process, first check that your images meet our guidelines (clear, well-lit, proper format). If problems persist, try refreshing the page or uploading different images. For continued issues, please contact our support team.'
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Help & FAQ
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Everything you need to know about using our outfit try-on platform
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">How to Use the Outfit Try-On Tool</h2>
          
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200">
              <li className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Upload Your Photo</h3>
                    <p className="mt-2 text-gray-600">
                      Take a clear, well-lit photo of yourself standing in a neutral pose. Upload this photo using the "Upload Your Photo" section.
                    </p>
                  </div>
                </div>
              </li>
              
              <li className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Upload Outfit Pieces</h3>
                    <p className="mt-2 text-gray-600">
                      Upload images of the clothing items you want to try on. You can upload upper body items (shirts, jackets) and/or lower body items (pants, skirts).
                    </p>
                  </div>
                </div>
              </li>
              
              <li className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Process Your Try-On</h3>
                    <p className="mt-2 text-gray-600">
                      Click the "Try On Outfit" button to process your images. Our AI will combine your photo with the outfit pieces to show you how they would look on you.
                    </p>
                  </div>
                </div>
              </li>
              
              <li className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">View and Save Results</h3>
                    <p className="mt-2 text-gray-600">
                      Once processing is complete, you'll see the result of your virtual try-on. You can download the image or create a short video animation to save or share.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Frequently Asked Questions</h2>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <dl className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="px-4 py-6 sm:px-6">
                  <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            If you couldn't find the answer to your question, feel free to contact our support team.
          </p>
          <a 
            href="mailto:support@outfittryon.com" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 