import { supabase } from './supabase';
import { uploadToStorj, uploadThumbnail } from './storageService';
import { SermonFormData, Sermon } from '../types/sermon';

export async function createSermon(data: SermonFormData, churchId: string): Promise<Sermon> {
  try {
    let videoUrl = data.videoUrl;
    let thumbnailUrl = data.thumbnail_url;

    if (data.videoFile) {
      videoUrl = await uploadToStorj(data.videoFile, churchId);
    }

    if (data.thumbnailFile) {
      thumbnailUrl = await uploadThumbnail(data.thumbnailFile, churchId);
    }

    const { data: sermon, error } = await supabase
      .from('sermons')
      .insert([{
        church_id: churchId,
        title: data.title,
        description: data.description,
        speaker_id: data.speaker_id || null,
        series_id: data.series_id || null,
        date: data.date,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl
      }])
      .select(`
        *,
        speaker:speakers(id, name),
        series:series(id, name)
      `)
      .single();

    if (error) throw error;
    return sermon;
  } catch (error) {
    console.error('Error creating sermon:', error);
    throw new Error('Failed to create sermon');
  }
}

export async function updateSermon(sermonId: string, data: SermonFormData, churchId: string): Promise<Sermon> {
  try {
    const updateData: Record<string, any> = {
      title: data.title,
      description: data.description,
      date: data.date,
      speaker_id: data.speaker_id || null,
      series_id: data.series_id || null,
      updated_at: new Date().toISOString()
    };

    if (data.videoFile) {
      updateData.video_url = await uploadToStorj(data.videoFile, churchId);
    } else if (data.videoUrl) {
      updateData.video_url = data.videoUrl;
    }

    if (data.thumbnailFile) {
      updateData.thumbnail_url = await uploadThumbnail(data.thumbnailFile, churchId);
    }

    const { data: updatedSermon, error } = await supabase
      .from('sermons')
      .update(updateData)
      .eq('id', sermonId)
      .eq('church_id', churchId)
      .select(`
        *,
        speaker:speakers(id, name),
        series:series(id, name)
      `)
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    if (!updatedSermon) {
      throw new Error('Sermon not found');
    }

    return updatedSermon;
  } catch (error) {
    console.error('Error updating sermon:', error);
    throw error;
  }
}