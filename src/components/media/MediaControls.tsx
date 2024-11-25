import React from 'react';
import { X, Cast, PictureInPicture } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPiP}
              className="hover:bg-primary/5 transition-colors"
            >
              <PictureInPicture className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Picture in Picture</p>
          </TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCast}
            className="hover:bg-primary/5 transition-colors"
            disabled={isCasting}
          >
            <Cast className={`h-4 w-4 ${isCasting ? 'text-primary animate-pulse' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCasting ? "Casting..." : "Cast to device"}</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Close player</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};