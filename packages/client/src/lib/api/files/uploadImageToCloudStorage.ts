import client from '../client';

export interface UploadImageParams {
  usedIn: string;
  directoryName: string;
  formData: FormData;
}

export type UploadImageResult = string;

export default async function uploadImageToCloudStorage({ usedIn, directoryName, formData }: UploadImageParams) {
  const result = await client.post<UploadImageResult>(
    `files/image?usedIn=${usedIn}&directoryName=${directoryName}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return result.data;
}
