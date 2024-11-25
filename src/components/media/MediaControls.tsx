import React from 'react';
import { X, Cast, PictureInPicture } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

interface MediaControlsProps {
  onClose: () => void;
  onPiP: () => void;
  onCast: () => void;
  isPiPSupported: boolean;
  isCasting: boolean;
}

export const MediaControls = ({
  onClose,
  onPiP,
  onCast,
  isPiPSupported,
  isCasting,
}: MediaControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      {isPiPSupported && (
        <Tooltip content="Picture in Picture">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPiP}
            className="hover:bg-primary/5 transition-colors"
          >
            <PictureInPicture className="h-4 w-4" />
          </Button>
        </Tooltip>
      )}
      <Tooltip content={isCasting ? "Casting..." : "Cast to device"}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCast}
          className="hover:bg-primary/5 transition-colors"
          disabled={isCasting}
        >
          <Cast className={`h-4 w-4 ${isCasting ? 'text-primary animate-pulse' : ''}`} />
        </Button>
      </Tooltip>
      <Tooltip content="Close player">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
};