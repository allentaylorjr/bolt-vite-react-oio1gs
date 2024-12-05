import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSpeakers } from '../../hooks/useSpeakers';
import { useSpeakerManagement } from '../../hooks/useSpeakerManagement';
import SpeakerCard from '../../components/speakers/SpeakerCard';
import SpeakerForm from '../../components/speakers/SpeakerForm';
import SpeakerEditModal from '../../components/speakers/SpeakerEditModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Speaker } from '../../types/speaker';

const SpeakersDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const { speakers, loading, error, refetch } = useSpeakers();
  const { deleteSpeaker } = useSpeakerManagement();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this speaker?')) {
      const success = await deleteSpeaker(id);
      if (success) {
        refetch();
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Speakers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your church's speakers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Speaker
        </button>
      </div>

      {showForm && (
        <SpeakerForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            refetch();
            setShowForm(false);
          }}
        />
      )}

      {editingSpeaker && (
        <SpeakerEditModal
          speaker={editingSpeaker}
          onClose={() => setEditingSpeaker(null)}
          onSuccess={() => {
            refetch();
            setEditingSpeaker(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {speakers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No speakers found.</p>
          </div>
        ) : (
          speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              onDelete={handleDelete}
              onEdit={setEditingSpeaker}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SpeakersDashboard;