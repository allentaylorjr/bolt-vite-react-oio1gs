import { supabase } from '../supabase';
import { uploadVideo, uploadThumbnail } from '../storage/uploadService';
import { Sermon, SermonFormData } from '../../types/sermon';
import { StorageError, ValidationError, AuthError, PermissionError } from '../../utils/errors';

async function validateSermonData(data: SermonFormData): Promise<void> {
  if (!data.title?.trim()) {
    throw new ValidationError('Sermon title is required');
  }

  if (!data.date) {
    throw new ValidationError('Sermon date is required');
  }

  if (!data.videoUrl && !data.videoFile) {
    throw new ValidationError('Either a video URL or video file is required');
  }
}

async function getChurchId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new AuthError('Authentication required');
  }

  const churchId = user.user_meta_data?.church_id;
  if (!churchId) {
    throw new PermissionError('Church ID not found in user metadata');
  }

  return churchId;
}

export async function createSermon(data: SermonFormData): Promise<Sermon> {
  try {
    await validateSermonData(data);
    const churchId = await getChurchId();

    let videoUrl = data.videoUrl;
    let thumbnailUrl = data.thumbnail_url;

    if (data.videoFile) {
      try {
        videoUrl = await uploadVideo(data.videoFile, churchId);
      } catch (error) {
        console.error('Video upload error:', error);
        throw new StorageError('Failed to upload video file');
      }
    }

    if (data.thumbnailFile) {
      try {
        thumbnailUrl = await uploadThumbnail(data.thumbnailFile, churchId);
      } catch (error) {
        console.error('Thumbnail upload error:', error);
        throw new StorageError('Failed to upload thumbnail');
      }
    }

    const { data: sermon, error } = await supabase
      .from('sermons')
      .insert([{
        church_id: churchId,
        title: data.title.trim(),
        description: data.description?.trim(),
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

    if (error) {
      console.error('Database error:', error);
      throw new PermissionError('Failed to create sermon');
    }

    if (!sermon) {
      throw new PermissionError('Failed to create sermon');
    }

    return sermon;
  } catch (error) {
    console.error('Error creating sermon:', error);
    throw error;
  }
}

export async function updateSermon(
  sermonId: string,
  data: SermonFormData
): Promise<Sermon> {
  try {
    await validateSermonData(data);
    const churchId = await getChurchId();

    const updateData: Record<string, any> = {
      title: data.title.trim(),
      description: data.description?.trim(),
      speaker_id: data.speaker_id || null,
      series_id: data.series_id || null,
      date: data.date
    };

    if (data.videoFile) {
      updateData.video_url = await uploadVideo(data.videoFile, churchId);
    } else if (data.videoUrl) {
      updateData.video_url = data.videoUrl;
    }

    if (data.thumbnailFile) {
      updateData.thumbnail_url = await uploadThumbnail(data.thumbnailFile, churchId);
    }

    const { data: sermon, error } = await supabase
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
      console.error('Database error:', error);
      throw new PermissionError('Failed to update sermon');
    }

    if (!sermon) {
      throw new PermissionError('Sermon not found');
    }

    return sermon;
  } catch (error) {
    console.error('Error updating sermon:', error);
    throw error;
  }
}

export async function deleteSermon(sermonId: string): Promise<void> {
  try {
    const churchId = await getChurchId();

    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', sermonId)
      .eq('church_id', churchId);

    if (error) {
      console.error('Database error:', error);
      throw new PermissionError('Failed to delete sermon');
    }
  } catch (error) {
    console.error('Error deleting sermon:', error);
    throw error;
  }
}