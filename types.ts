
export enum AutoPosition {
  TopLeft = 'top-left',
  TopCenter = 'top-center',
  TopRight = 'top-right',
  CenterLeft = 'center-left',
  Center = 'center',
  CenterRight = 'center-right',
  BottomLeft = 'bottom-left',
  BottomCenter = 'bottom-center',
  BottomRight = 'bottom-right',
}

export interface WatermarkSettings {
  text: string;
  color: string;
  fontSize: number;
  opacity: number;
  position: { x: number; y: number };
  autoPosition: AutoPosition;
}

export interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
}
