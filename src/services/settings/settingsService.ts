import { supabase } from '../supabase';
import { ChurchSettings, SettingsUpdateResponse } from './types';
import { validateSettings } from './validation';
import { uploadChurchLogo } from '../storage/uploadService';

export async function updateChurchSettings(
  settings: ChurchSettings,
  logoFile?: File
): Promise<SettingsUpdateResponse> {
  try {
    // Validate settings
    validateSettings(settings);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const churchId = user.user_metadata?.church_id;
    if (!churchId) {
      return {
        success: false,
        error: 'Church ID not found'
      };
    }

    // Upload logo if provided
    let logo_url = settings.logo_url;
    if (logoFile) {
      try {
        logo_url = await uploadChurchLogo(logoFile, churchId);
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
        return {
          success: false,
          error: 'Failed to upload logo'
        };
      }
    }

    // Update church settings
    const { error: updateError } = await supabase
      .from('churches')
      .update({
        name: settings.name,
        description: settings.description || null,
        website: settings.website || null,
        logo_url,
        primary_color: settings.primary_color,
        button_text_color: settings.button_text_color,
        accent_color: settings.accent_color,
        font_family: settings.font_family,
        updated_at: new Date().toISOString()
      })
      .eq('id', churchId);

    if (updateError) {
      console.error('Database update error:', updateError);
      return {
        success: false,
        error: updateError.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Settings update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update settings'
    };
  }
}