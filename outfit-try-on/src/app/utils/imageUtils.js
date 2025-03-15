export const isValidImageType = async (file) => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    return false;
  }
  return true;
};

export const checkImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width < 512 || img.height < 512) {
        reject(new Error(`Image dimensions too small. Images must be at least 512x512 pixels. Current size: ${img.width}x${img.height}px`));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for dimension checking'));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const convertToPNG = async (file) => {
  // If already PNG, return the file
  if (file.type === 'image/png') {
    return file;
  }

  // Convert to PNG
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), {
            type: 'image/png',
            lastModified: Date.now()
          });
          URL.revokeObjectURL(img.src);
          resolve(newFile);
        } else {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to convert image to PNG'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for conversion'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}; 