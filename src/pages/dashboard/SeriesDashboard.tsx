import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSeries } from '../../hooks/useSeries';
import { useSeriesManagement } from '../../hooks/useSeriesManagement';
import SeriesCard from '../../components/series/SeriesCard';
import SeriesForm from '../../components/series/SeriesForm';
import SeriesEditModal from '../../components/series/SeriesEditModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Series } from '../../types/series';

const SeriesDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const { series, loading, error, refetch } = useSeries();
  const { deleteSeries } = useSeriesManagement();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this series?')) {
      const success = await deleteSeries(id);
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
          <h1 className="text-2xl font-bold text-gray-900">Series</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your sermons into series
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Series
        </button>
      </div>

      {showForm && (
        <SeriesForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            refetch();
            setShowForm(false);
          }}
        />
      )}

      {editingSeries && (
        <SeriesEditModal
          series={editingSeries}
          onClose={() => setEditingSeries(null)}
          onSuccess={() => {
            refetch();
            setEditingSeries(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {series.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No series found.</p>
          </div>
        ) : (
          series.map((item) => (
            <SeriesCard
              key={item.id}
              series={item}
              onDelete={handleDelete}
              onEdit={setEditingSeries}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SeriesDashboard;