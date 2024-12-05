import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SermonFormData, UploadResponse } from '../types/sermon';
import { SermonError, handleUploadError } from '../utils/errorHandler';

const s3Client = new S3Client({
  endpoint: 'https://gateway.storjshare.io',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'jx33ixog5iw6ar4du6trc6qbpgwq',
    secretAccessKey: 'j26ujs7mimrqilfgzczuwl6gk52tunxz32e6bm7hgtsoyptjcrxw4'
  },
  forcePathStyle: true
});

async function uploadToStorj(file: File, churchId: string): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const key = `${churchId}/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: 'sermon-videos',
      Key: key,
      Body: await file.arrayBuffer(),
      ContentType: file.type
    });

    await s3Client.send(command);
    return `https://gateway.storjshare.io/sermon-videos/${key}`;
  } catch (error) {
    throw new SermonError(
      'Failed to upload video file',
      'STORAGE_UPLOAD_ERROR'
    );
  }
}

export async function uploadSermon(data: SermonFormData, churchId: string): Promise<UploadResponse> {
  try {
    let videoUrl = data.videoUrl;

    if (data.videoFile) {
      videoUrl = await uploadToStorj(data.videoFile, churchId);
    }

    const sermonData = {
      title: data.title,
      description: data.description,
      speaker: data.speaker,
      series: data.series,
      date: data.date,
      video_url: videoUrl,
      church_id: churchId
    };

    const response = await axios.post('/api/sermons', sermonData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    const sermonError = handleUploadError(error);
    return {
      success: false,
      error: sermonError.toJSON()
    };
  }
}