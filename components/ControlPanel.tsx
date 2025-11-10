
import React from 'react';
import { WatermarkSettings, AutoPosition } from '../types';
import { PositionIcon } from './icons';

interface ControlPanelProps {
  settings: WatermarkSettings;
  onSettingsChange: (newSettings: Partial<WatermarkSettings>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onSettingsChange }) => {

  const positionButtons: { position: AutoPosition, path: string }[] = [
    { position: AutoPosition.TopLeft, path: 'M4 4h8v8H4z' },
    { position: AutoPosition.TopCenter, path: 'M8 4h8v8H8z' },
    { position: AutoPosition.TopRight, path: 'M12 4h8v8h-8z' },
    { position: AutoPosition.CenterLeft, path: 'M4 8h8v8H4z' },
    { position: AutoPosition.Center, path: 'M8 8h8v8H8z' },
    { position: AutoPosition.CenterRight, path: 'M12 8h8v8h-8z' },
    { position: AutoPosition.BottomLeft, path: 'M4 12h8v8H4z' },
    { position: AutoPosition.BottomCenter, path: 'M8 12h8v8H8z' },
    { position: AutoPosition.BottomRight, path: 'M12 12h8v8h-8z' },
  ];

  return (
    <div className="w-80 bg-slate-800 p-6 flex flex-col space-y-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white">Controls</h2>
      
      {/* Text Input */}
      <div>
        <label htmlFor="watermark-text" className="block text-sm font-medium text-slate-300 mb-2">
          Watermark Text
        </label>
        <input
          type="text"
          id="watermark-text"
          value={settings.text}
          onChange={(e) => onSettingsChange({ text: e.target.value })}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
          placeholder="Your Brand"
        />
      </div>

      {/* Font Size */}
      <div>
        <label htmlFor="font-size" className="block text-sm font-medium text-slate-300 mb-2">
          Font Size ({settings.fontSize}px)
        </label>
        <input
          type="range"
          id="font-size"
          min="10"
          max="200"
          value={settings.fontSize}
          onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Opacity */}
      <div>
        <label htmlFor="opacity" className="block text-sm font-medium text-slate-300 mb-2">
          Opacity ({Math.round(settings.opacity * 100)}%)
        </label>
        <input
          type="range"
          id="opacity"
          min="0"
          max="1"
          step="0.01"
          value={settings.opacity}
          onChange={(e) => onSettingsChange({ opacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* Color Picker */}
      <div>
        <label htmlFor="color-picker" className="block text-sm font-medium text-slate-300 mb-2">
          Color
        </label>
        <div className="relative">
          <input
            type="color"
            id="color-picker"
            value={settings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value })}
            className="p-1 h-10 w-full block bg-slate-700 border border-slate-600 cursor-pointer rounded-md"
          />
        </div>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Position
        </label>
        <p className="text-xs text-slate-400 mb-2">Click to place or drag on image.</p>
        <div className="grid grid-cols-3 gap-2">
          {positionButtons.map(({position, path}) => (
             <button
              key={position}
              onClick={() => onSettingsChange({ autoPosition: position })}
              className={`p-2 rounded-md transition-colors ${settings.autoPosition === position ? 'bg-sky-600' : 'bg-slate-700 hover:bg-slate-600'}`}
              title={position.replace('-', ' ')}
            >
              <PositionIcon className="w-6 h-6 mx-auto text-white" position={path} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
