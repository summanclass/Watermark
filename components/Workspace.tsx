
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ImageFile, WatermarkSettings, AutoPosition } from '../types';
import { DownloadIcon } from './icons';

interface WorkspaceProps {
  image: ImageFile | null;
  settings: WatermarkSettings;
  onSettingsChange: (newSettings: Partial<WatermarkSettings>) => void;
  onDownload: (image: ImageFile, canvas: HTMLCanvasElement) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ image, settings, onSettingsChange, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const container = containerRef.current;
    if (!canvas || !ctx || !container || !image) return;

    const img = new Image();
    img.src = image.dataUrl;
    img.onload = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imgAspectRatio = img.width / img.height;
      const containerAspectRatio = containerWidth / containerHeight;

      let canvasWidth, canvasHeight;

      if (imgAspectRatio > containerAspectRatio) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imgAspectRatio;
      } else {
        canvasHeight = containerHeight;
        canvasWidth = containerHeight * imgAspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = settings.color;
      ctx.globalAlpha = settings.opacity;
      const fontSize = settings.fontSize * (canvas.width / img.width);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let { x, y } = settings.position;
      
      const textMetrics = ctx.measureText(settings.text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      const margin = 0.05 * canvas.width;

      switch (settings.autoPosition) {
        case AutoPosition.TopLeft:
            x = margin;
            y = margin;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
        case AutoPosition.TopCenter:
            x = canvas.width / 2;
            y = margin;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            break;
        case AutoPosition.TopRight:
            x = canvas.width - margin;
            y = margin;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            break;
        case AutoPosition.CenterLeft:
            x = margin;
            y = canvas.height / 2;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            break;
        case AutoPosition.Center:
            x = canvas.width / 2;
            y = canvas.height / 2;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            break;
        case AutoPosition.CenterRight:
            x = canvas.width - margin;
            y = canvas.height / 2;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            break;
        case AutoPosition.BottomLeft:
            x = margin;
            y = canvas.height - margin;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            break;
        case AutoPosition.BottomCenter:
            x = canvas.width / 2;
            y = canvas.height - margin;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            break;
        case AutoPosition.BottomRight:
            x = canvas.width - margin;
            y = canvas.height - margin;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            break;
        default: // Manual
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
      }

      ctx.fillText(settings.text, x, y);
      ctx.globalAlpha = 1.0;
    };
  }, [image, settings]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);


  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    // A simple check if the click is "near" the watermark - can be improved
    // For now, we assume any drag on canvas starts a watermark drag
    setIsDragging(true);
    setDragOffset({ x: settings.position.x - pos.x, y: settings.position.y - pos.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const pos = getMousePos(e);
    onSettingsChange({
      position: {
        x: pos.x + dragOffset.x,
        y: pos.y + dragOffset.y,
      },
      autoPosition: AutoPosition.Center // Switch to a "manual" mode
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleDownloadClick = () => {
      if(image && canvasRef.current){
          onDownload(image, canvasRef.current);
      }
  }

  return (
    <div className="flex-1 bg-slate-900 flex flex-col p-4">
      {image ? (
        <>
        <div ref={containerRef} className="flex-1 flex items-center justify-center relative w-full h-full min-h-0">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
        <div className="flex-shrink-0 pt-4 flex justify-center">
            <button 
              onClick={handleDownloadClick}
              className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Download Image</span>
            </button>
        </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Select an image to start</p>
        </div>
      )}
    </div>
  );
};

export default Workspace;
