import React, { useState, useEffect } from 'react';
import { Calendar, User, PlayCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Sermon {
  id: number;
  title: string;
  description: string;
  speaker: string;
  date: string;
  video_url: string;
  series: string;
}

const SermonList = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { churchId } = useAuth();

  useEffect(() => {
    if (!churchId) {
      setError('Please log in to view sermons');
      setLoading(false);
      return;
    }

    fetch(`/api/sermons/${churchId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch sermons');
        }
        return res.json();
      })
      .then(data => {
        setSermons(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching sermons:', error);
        setError('Failed to load sermons. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [churchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Recent Sermons</h1>
      {sermons.length === 0 ? (
        <p className="text-center text-gray-600">No sermons found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-blue-600" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-2">{sermon.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{sermon.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {sermon.speaker}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(sermon.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SermonList;