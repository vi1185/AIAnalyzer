import React from 'react';
import { Wand2, ImageIcon } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: string;
  loading: boolean;
  generating: boolean;
  onGenerate: () => void;
  generatedImages: string[];
}

export function AnalysisPanel({ 
  analysis, 
  loading, 
  generating, 
  onGenerate, 
  generatedImages 
}: AnalysisPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          AI Analysis
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-line">{analysis}</p>
        )}
      </div>

      {analysis && (
        <button
          onClick={onGenerate}
          disabled={generating}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold
            hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-5 h-5" />
          {generating ? 'Generating...' : 'Generate New Designs'}
        </button>
      )}

      {generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {generatedImages.map((url, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden shadow-lg">
              <img src={url} alt={`Generated design ${index + 1}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}