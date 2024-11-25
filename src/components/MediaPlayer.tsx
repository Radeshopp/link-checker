import React, { useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useToast } from './ui/use-toast';
import { MediaControls } from './media/MediaControls';
import { VideoPlayer } from './media/VideoPlayer';
import { useScreenOrientation } from './media/useScreenOrientation';

interface MediaPlayerProps {
  url: string;
  onClose: () => void;
}

export const MediaPlayer = ({ url, onClose }: MediaPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  useScreenOrientation(videoRef.current);

  React.useEffect(() => {
    setIsPiPSupported(document.pictureInPictureEnabled || false);
  }, []);

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      toast({
        title: "PiP Error",
        description: "Failed to enter picture-in-picture mode",
        variant: "destructive",
      });
    }
  };

  const castToDevice = async () => {
    try {
      if ('presentation' in navigator && 'defaultRequest' in (navigator as any).presentation) {
        setIsCasting(true);
        toast({
          title: "Casting",
          description: "Looking for available devices...",
        });

        const presentationRequest = new (window as any).PresentationRequest([url]);
        const connection = await presentationRequest.start();
        
        connection.addEventListener('connect', () => {
          toast({
            title: "Connected",
            description: "Successfully connected to display device",
          });
        });

        connection.addEventListener('close', () => {
          setIsCasting(false);
          toast({
            title: "Disconnected",
            description: "Cast session ended",
          });
        });
      } else {
        toast({
          title: "Not Supported",
          description: "Casting is not supported in this browser",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsCasting(false);
      toast({
        title: "Cast Error",
        description: "Failed to start casting session",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 animate-fade-in shadow-lg border-2 border-primary/10">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-sm font-medium text-primary">Now Playing</h3>
          </div>
          <MediaControls
            onClose={onClose}
            onPiP={togglePiP}
            onCast={castToDevice}
            isPiPSupported={isPiPSupported}
            isCasting={isCasting}
          />
        </div>
        <VideoPlayer url={url} />
      </CardContent>
    </Card>
  );
};