import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, RotateCcw } from 'lucide-react';

interface ImageUploaderProps {
  image: string | null;
  onImageUpload: (file: File) => void;
  onReset: () => void;
}

export function ImageUploader({ image, onImageUpload, onReset }: ImageUploaderProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    maxSize: 10485760 // 10MB
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Drag & drop your t-shirt design here, or click to select</p>
        <p className="text-sm text-gray-500 mt-2">Maximum file size: 10MB</p>
      </div>

      {image && (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img src={image} alt="Uploaded design" className="w-full h-auto" />
          <button
            onClick={onReset}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}