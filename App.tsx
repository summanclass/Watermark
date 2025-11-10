
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import Workspace from './components/Workspace';
import ThumbnailGallery from './components/ThumbnailGallery';
import { ImageFile, WatermarkSettings, AutoPosition } from './types';

const MAX_FILES = 5;

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>({
    text: 'Your Watermark',
    color: '#ffffff',
    fontSize: 48,
    opacity: 0.5,
    position: { x: 100, y: 100 },
    autoPosition: AutoPosition.BottomRight,
  });

  const handleUpload = useCallback((files: FileList) => {
    const newImages: ImageFile[] = [];
    const filesArray = Array.from(files);

    for (let i = 0; i < Math.min(filesArray.length, MAX_FILES - images.length); i++) {
      const file = filesArray[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ImageFile = {
            id: `${file.name}-${Date.now()}`,
            file,
            dataUrl: e.target?.result as string,
          };
          newImages.push(newImage);

          if (i === Math.min(filesArray.length, MAX_FILES - images.length) - 1) {
            setImages((prevImages) => [...prevImages, ...newImages]);
            if (!activeImageId) {
              setActiveImageId(newImages[0].id);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [images.length, activeImageId]);

  const handleSettingsChange = (newSettings: Partial<WatermarkSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectImage = (id: string) => {
    setActiveImageId(id);
  };
  
  const handleClearAll = () => {
    setImages([]);
    setActiveImageId(null);
  }
  
  const handleDownload = (image: ImageFile, canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `watermarked-${image.file.name}`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };


  const activeImage = images.find((img) => img.id === activeImageId) || null;

  if (images.length === 0) {
    return <ImageUploader onUpload={handleUpload} maxFiles={MAX_FILES} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <ControlPanel settings={settings} onSettingsChange={handleSettingsChange} />
      <Workspace 
        image={activeImage} 
        settings={settings} 
        onSettingsChange={handleSettingsChange}
        onDownload={handleDownload}
       />
      <ThumbnailGallery 
        images={images} 
        activeImageId={activeImageId} 
        onSelectImage={handleSelectImage} 
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default App;
