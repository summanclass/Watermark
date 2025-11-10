
import React from 'react';
import { ImageFile } from '../types';

interface ThumbnailGalleryProps {
  images: ImageFile[];
  activeImageId: string | null;
  onSelectImage: (id: string) => void;
  onClearAll: () => void;
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ images, activeImageId, onSelectImage, onClearAll }) => {
  return (
    <div className="w-96 bg-slate-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Your Images</h2>
        <button onClick={onClearAll} className="text-sm text-red-400 hover:text-red-300 transition-colors">Clear All</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => onSelectImage(image.id)}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${
              activeImageId === image.id ? 'border-sky-500' : 'border-transparent hover:border-slate-600'
            }`}
          >
            <img src={image.dataUrl} alt={image.file.name} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2">
                <p className="text-white text-xs truncate">{image.file.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailGallery;
