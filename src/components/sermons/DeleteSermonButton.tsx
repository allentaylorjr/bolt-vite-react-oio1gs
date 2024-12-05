import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSermonDelete } from '../../hooks/useSermonDelete';

interface DeleteSermonButtonProps {
  sermonId: string;
  onSuccess: () => void;
}

const DeleteSermonButton: React.FC<DeleteSermonButtonProps> = ({ sermonId, onSuccess }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteSermon, isDeleting, error } = useSermonDelete();

  const handleDelete = async () => {
    const success = await deleteSermon(sermonId);
    if (success) {
      setShowConfirm(false);
      onSuccess();
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-gray-500 hover:text-red-600 focus:outline-none"
      title="Delete sermon"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
};

export default DeleteSermonButton;