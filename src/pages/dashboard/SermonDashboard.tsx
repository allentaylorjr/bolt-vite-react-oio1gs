import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SermonGrid from '../../components/sermons/SermonGrid';
import SermonForm from '../../components/sermons/SermonForm';
import SermonEditModal from '../../components/sermons/SermonEditModal';
import { useSermons } from '../../hooks/useSermons';
import { Sermon } from '../../types/sermon';

const SermonDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const { sermons, loading, error, refetch } = useSermons();

  const handleSermonClick = (sermon: Sermon) => {
    setEditingSermon(sermon);
  };

  const handleEditSuccess = () => {
    setEditingSermon(null);
    refetch();
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your church's sermon library
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Sermon
        </button>
      </div>

      {showForm && (
        <SermonForm 
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refetch();
          }}
        />
      )}

      {editingSermon && (
        <SermonEditModal
          sermon={editingSermon}
          onClose={() => setEditingSermon(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      <SermonGrid
        sermons={sermons}
        loading={loading}
        error={error}
        onSermonClick={handleSermonClick}
        onSermonDelete={handleDeleteSuccess}
      />
    </div>
  );
};

export default SermonDashboard;