
import React, { useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onUpload: (files: FileList) => void;
  maxFiles: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, maxFiles }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.dataTransfer.files) {
        onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="w-full max-w-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Image Watermark Generator</h1>
        <p className="text-slate-400 mb-8">Add custom watermarks to your images with ease.</p>
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-400">
              <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF (MAX {maxFiles} images)</p>
          </div>
          <input 
            type="file" 
            id="file-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            multiple 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
