import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Bookmark, ExternalLink, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import { ChurchThemeProvider } from '../contexts/ChurchThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { Sermon } from '../types/sermon';
import { Church } from '../types/church';
import VideoPlayer from '../components/video/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { sendSermonNotes } from '../services/emailService';

const SermonContent = () => {
  const { churchSlug, sermonId } = useParams();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    const fetchData = async () => {
      if (!churchSlug || !sermonId) {
        setError('Invalid sermon URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: churchData, error: churchError } = await supabase
          .from('churches')
          .select('*')
          .eq('slug', churchSlug)
          .single();

        if (churchError) throw churchError;
        if (!churchData) throw new Error('Church not found');

        setChurch(churchData);

        const { data: sermonData, error: sermonError } = await supabase
          .from('sermons')
          .select(`
            *,
            speaker:speakers(id, name),
            series:series(id, name)
          `)
          .eq('id', sermonId)
          .eq('church_id', churchData.id)
          .single();

        if (sermonError) throw sermonError;
        if (!sermonData) throw new Error('Sermon not found');

        setSermon(sermonData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sermon');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [churchSlug, sermonId]);

  const handleEmailNotes = async () => {
    if (!email || !notes || !sermon || !church) {
      setEmailError('Please enter an email address and notes');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      setSendingEmail(true);
      setEmailError(null);

      await sendSermonNotes({
        to_email: email,
        church_name: church.name,
        sermon_title: sermon.title,
        date: new Date(sermon.date).toLocaleDateString(),
        speaker: sermon.speaker?.name || '',
        series: sermon.series?.name || '',
        notes: notes
      });

      setEmailSuccess(true);
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailSuccess(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      console.error('Error sending email:', err);
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const downloadNotes = () => {
    if (!sermon) return;
    
    const filename = `sermon-notes-${sermon.date}-${sermon.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!sermon || !church) return <ErrorMessage message="Sermon not found" />;

  const buttonStyles = {
    backgroundColor: colors.button.background,
    color: colors.button.text
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {church.logo_url ? (
                <img
                  src={church.logo_url}
                  alt={church.name}
                  className="h-16 w-auto"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="h-16 w-16 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {church.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/${churchSlug}`}
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sermons
              </Link>
              {church.website && (
                <a
                  href={church.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-900 shadow-sm transition-colors"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Video Section */}
      <div className="bg-[#EEEEEE] pb-16 pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative -mb-[85px]">
            <div className="max-w-[850px] mx-auto rounded-xl overflow-hidden shadow-[24px_24px_52px_0px_rgba(0,0,0,0.24)]">
              {sermon.video_url ? (
                <VideoPlayer 
                  url={sermon.video_url} 
                  title={sermon.title}
                />
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
                  <p>No video available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{sermon.title}</h1>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(sermon.date).toLocaleDateString()}
              </div>
              {sermon.series && (
                <div className="flex items-center">
                  <Bookmark className="w-4 h-4 mr-2" />
                  {sermon.series.name}
                </div>
              )}
              {sermon.speaker && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {sermon.speaker.name}
                </div>
              )}
            </div>
            {sermon.description && (
              <p className="text-gray-600 whitespace-pre-line">{sermon.description}</p>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-black text-gray-900">Notes</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEmailModalOpen(true)}
                    className="px-6 py-3 text-base font-medium rounded-lg hover:opacity-90 transition-colors"
                    style={buttonStyles}
                  >
                    Email Notes
                  </button>
                  <button
                    onClick={downloadNotes}
                    className="px-6 py-3 text-base font-medium rounded-lg hover:opacity-90 transition-colors"
                    style={buttonStyles}
                  >
                    Download Notes
                  </button>
                </div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take your sermon notes here..."
                className="w-full h-[400px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Email Notes</h3>
            {emailError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                {emailError}
              </div>
            )}
            {emailSuccess && (
              <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg">
                Email sent successfully!
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEmailModalOpen(false);
                  setEmailError(null);
                  setEmail('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailNotes}
                disabled={sendingEmail || !email}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={buttonStyles}
              >
                {sendingEmail ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SermonPage = () => {
  const { churchSlug } = useParams();
  const [churchId, setChurchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChurchId = async () => {
      if (!churchSlug) return;

      try {
        const { data, error } = await supabase
          .from('churches')
          .select('id')
          .eq('slug', churchSlug)
          .single();

        if (error) throw error;
        if (data) {
          setChurchId(data.id);
        }
      } catch (err) {
        console.error('Error fetching church:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchId();
  }, [churchSlug]);

  if (loading) return <LoadingSpinner />;
  if (!churchId) return <ErrorMessage message="Church not found" />;
  
  return (
    <ChurchThemeProvider churchId={churchId}>
      <SermonContent />
    </ChurchThemeProvider>
  );
};

export default SermonPage;