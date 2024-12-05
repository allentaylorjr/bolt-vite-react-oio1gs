import api from './api';
import { uploadFile } from './storage';
import { SermonFormData, Sermon } from '../types/sermon';
import { ValidationError } from '../utils/errors';

export async function createSermon(data: SermonFormData, churchId: string): Promise<Sermon> {
  let videoUrl = data.videoUrl;

  if (!videoUrl && !data.videoFile) {
    throw new ValidationError('Video URL or file is required');
  }

  if (data.videoFile) {
    videoUrl = await uploadFile(data.videoFile, churchId);
  }

  const response = await api.post<Sermon>('/sermons', {
    title: data.title,
    description: data.description,
    speaker: data.speaker,
    series: data.series,
    date: data.date,
    video_url: videoUrl,
    church_id: churchId
  });

  return response.data;
}

export async function getSermons(churchId: string): Promise<Sermon[]> {
  const response = await api.get<Sermon[]>(`/sermons/${churchId}`);
  return response.data;
}