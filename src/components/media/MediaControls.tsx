import React from 'react';
import { X, Airplay, Cast, PictureInPicture } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
        <Button
          variant="ghost"
          size="sm"
          onClick={onPiP}
          className="hover:bg-primary/10 transition-colors"
        >
          <PictureInPicture className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCast}
        className="hover:bg-primary/10 transition-colors"
        disabled={isCasting}
      >
        {isCasting ? (
          <Cast className="h-4 w-4 animate-pulse text-primary" />
        ) : (
          <Airplay className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="hover:bg-destructive/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};