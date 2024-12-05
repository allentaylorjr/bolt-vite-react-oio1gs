import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="text-center py-16">
    <div className="inline-block px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200">
      {message}
    </div>
  </div>
);

export default ErrorMessage;