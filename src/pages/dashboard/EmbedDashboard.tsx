import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Copy, Info } from 'lucide-react';
import { generateEmbedCode } from '../../utils/iframe/embed';

const EmbedDashboard = () => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const baseUrl = window.location.origin;

  const embedCodes = {
    collection: generateEmbedCode(baseUrl, user?.user_metadata?.church_id),
    sermon: generateEmbedCode(baseUrl, user?.user_metadata?.church_id, '[SERMON_ID]')
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Embed</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add your sermon content to any website with these embed codes
        </p>
      </div>

      <div className="space-y-6">
        {/* Collection Embed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sermon Collection</h2>
          <p className="text-sm text-gray-500 mb-4">
            Embed your entire sermon collection with search and filtering capabilities.
          </p>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {embedCodes.collection}
            </pre>
            <button
              onClick={() => handleCopy(embedCodes.collection)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
            >
              <Copy className="h-5 w-5" />
              {copiedCode === embedCodes.collection && (
                <span className="absolute right-0 top-full mt-1 text-xs text-green-600 whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Single Sermon Embed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Single Sermon</h2>
          <p className="text-sm text-gray-500 mb-4">
            Embed individual sermons with video player and details.
            Replace [SERMON_ID] with the ID of the sermon you want to embed.
          </p>
          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {embedCodes.sermon}
            </pre>
            <button
              onClick={() => handleCopy(embedCodes.sermon)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
            >
              <Copy className="h-5 w-5" />
              {copiedCode === embedCodes.sermon && (
                <span className="absolute right-0 top-full mt-1 text-xs text-green-600 whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Implementation Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Implementation Guide</h2>
          <div className="prose prose-sm max-w-none">
            <div className="flex items-start space-x-2 mb-4 p-4 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Auto-Resizing Feature</p>
                <p>
                  The embed codes use iframe-resizer, a robust library that ensures your embedded content
                  always displays correctly without scrollbars, automatically adjusting to content changes.
                </p>
              </div>
            </div>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Copy the embed code for the content you want to display.</li>
              <li>Paste the code into your website's HTML where you want the content to appear.</li>
              <li>For single sermons, replace [SERMON_ID] with the actual sermon ID.</li>
              <li>The embed will automatically adjust to fit its container width.</li>
              <li>The height will automatically adjust based on the content.</li>
              <li>The iframe-resizer library handles all sizing calculations.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedDashboard;