import React, { useState, useEffect } from 'react';
import { Shirt } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisPanel } from './components/AnalysisPanel';
import { analyzeImage } from './services/imageAnalysis';
import { generateDesigns } from './services/imageGeneration';
import { revokeObjectURLs } from './utils/cleanup';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Cleanup object URLs when component unmounts or when new images are generated
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
      if (generatedImages.length > 0) {
        revokeObjectURLs(generatedImages);
      }
    };
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      setError('');
      
      // Cleanup previous image URL if it exists
      if (image) {
        URL.revokeObjectURL(image);
      }
      
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      
      // Analyze the image
      const result = await analyzeImage(file);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDesigns = async () => {
    try {
      setGenerating(true);
      setError('');

      // Cleanup previous generated image URLs
      if (generatedImages.length > 0) {
        revokeObjectURLs(generatedImages);
        setGeneratedImages([]);
      }

      const designs = await generateDesigns(analysis);
      setGeneratedImages(designs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    if (generatedImages.length > 0) {
      revokeObjectURLs(generatedImages);
    }
    setImage(null);
    setAnalysis('');
    setGeneratedImages([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Shirt className="w-10 h-10 text-indigo-600" />
            AI T-Shirt Design Studio
          </h1>
          <p className="text-gray-600">Upload your t-shirt design for AI analysis and get new design suggestions</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ImageUploader
            image={image}
            onImageUpload={handleImageUpload}
            onReset={reset}
          />
          
          <AnalysisPanel
            analysis={analysis}
            loading={loading}
            generating={generating}
            onGenerate={handleGenerateDesigns}
            generatedImages={generatedImages}
          />
        </div>
      </div>
    </div>
  );
}

export default App;