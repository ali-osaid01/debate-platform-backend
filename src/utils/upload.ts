import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dlmeuxeum', 
    api_key: '288633415826959', 
    api_secret: 'NeNK_L_VF0s9pVE3_Vpz3VBz9nY' 
});

const uploadOnCloudinary = async (localFilePath: string): Promise<string | null> => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
    console.log('File uploaded to Cloudinary:', response.secure_url);
    return response.secure_url;
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error.message || error);
    throw new Error('Cloudinary upload failed');
  }
};

export default uploadOnCloudinary;
