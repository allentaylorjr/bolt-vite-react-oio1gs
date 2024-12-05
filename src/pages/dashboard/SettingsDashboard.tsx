import React, { useState, useEffect } from 'react';
import { useChurchSettings } from '../../hooks/useChurchSettings';
import { ChurchSettings } from '../../services/settings/types';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Save } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import LogoUploader from '../../components/settings/LogoUploader';

const SettingsDashboard = () => {
  const { user } = useAuth();
  const { updateSettings, loading, error } = useChurchSettings();
  const [settings, setSettings] = useState<ChurchSettings>({
    name: '',
    description: '',
    website: '',
    logo_url: '',
    primary_color: '#2563eb',
    button_text_color: '#FFFFFF',
    accent_color: '#FFFFFF',
    font_family: 'Inter'
  });
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.user_metadata?.church_id) return;

      try {
        setLoadingInitial(true);
        const { data, error: fetchError } = await supabase
          .from('churches')
          .select('*')
          .eq('id', user.user_metadata.church_id)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setSettings({
            name: data.name,
            description: data.description || '',
            website: data.website || '',
            logo_url: data.logo_url || '',
            primary_color: data.primary_color,
            button_text_color: data.button_text_color,
            accent_color: data.accent_color,
            font_family: data.font_family
          });
        }
      } catch (err) {
        console.error('Error fetching church settings:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchSettings();
  }, [user?.user_metadata?.church_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(settings, logoFile || undefined);
    if (success) {
      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loadingInitial) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Church Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize your church's profile and sermon page appearance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          <LogoUploader
            onFileSelect={setLogoFile}
            currentLogo={settings.logo_url}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="input py-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="input py-3"
              rows={4}
              placeholder="Tell visitors about your church"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              className="input py-3"
              placeholder="https://your-church-website.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="input py-3 flex-1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#2563eb"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text Color
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={settings.button_text_color}
                  onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                  className="h-10 w-20"
                />
                <input
                  type="text"
                  value={settings.button_text_color}
                  onChange={(e) => setSettings({ ...settings, button_text_color: e.target.value })}
                  className="input py-3 flex-1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="input py-3 flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
                placeholder="#FFFFFF"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              We recommend using white (#FFFFFF) for the best viewing experience
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={settings.font_family}
              onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
              className="input py-3"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsDashboard;