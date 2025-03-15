# Custom Images Directory

This directory is for storing custom images used in the Outfit Try-On application.

## Required Images

1. **Logo Image**
   - File: `logo.png`
   - Size: Recommended 40x40 pixels
   - Used in: Header component

2. **Hero Example Image**
   - File: `hero-example.jpg`
   - Size: Recommended at least 600x400 pixels
   - Used in: Hero component on the homepage

## How to Add Your Images

1. Simply place your images in this directory with the filenames mentioned above.
2. The application will automatically use these images.
3. If the images are not found, fallback placeholders will be displayed.

## Image Formats

- For logo: PNG format with transparency is recommended
- For hero image: JPG or PNG format is recommended

## Next.js Image Optimization

This application uses Next.js Image component which automatically optimizes your images for better performance. The images will be:

- Automatically served in modern formats like WebP
- Automatically resized to avoid shipping large images to devices with smaller viewports
- Lazy loaded by default (images load as they enter the viewport)

## Public Directory Alternative

If you prefer, you can also place your images in the `/public/images/` directory. In that case, you'll need to update the image paths in the components to point to the public directory. 