# Public Images Directory

This directory is an alternative location for storing images used in the Outfit Try-On application.

## How to Use This Directory

1. Place your images in this directory.
2. Reference them in your components using the path `/images/your-image-name.jpg`.

## Recommended Images

1. **Logo Image**
   - File: `logo.png`
   - Size: Recommended 40x40 pixels
   - Used in: Header component

2. **Hero Example Image**
   - File: `hero-example.jpg`
   - Size: Recommended at least 600x400 pixels
   - Used in: Hero component on the homepage

## Advantages of the Public Directory

- Files in the public directory are served as-is without processing
- Good for static assets that don't need optimization
- Easier to reference with absolute URLs

## Note

The application is currently configured to look for images in the `/images/` path. If you place your images here, they will be automatically used by the application. 