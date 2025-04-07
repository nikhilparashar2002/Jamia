import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are not properly configured');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes: number;
}

export const uploadToCloudinary = async (
  file: string,
  options: { folder?: string; transformation?: any[] } = {}
): Promise<UploadResponse> => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'seo-content',
      transformation: options.transformation,
      resource_type: 'auto',
      timeout: 120000, // 2 minutes timeout
      chunk_size: 6000000, // 6MB chunks for better handling of large files
    });

    return {
      public_id: uploadResponse.public_id,
      secure_url: uploadResponse.secure_url,
      format: uploadResponse.format,
      resource_type: uploadResponse.resource_type,
      width: uploadResponse.width,
      height: uploadResponse.height,
      bytes: uploadResponse.bytes,
    };
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    if (error.http_code === 499 || error.message?.includes('timeout')) {
      throw new Error('Upload timeout - The file may be too large or the connection is slow. Please try again.');
    }
    throw error;
  }
};

export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    width: options.width,
    height: options.height,
    quality: options.quality || 'auto',
    fetch_format: options.format || 'auto',
    crop: 'fill',
  });
};

export default cloudinary;