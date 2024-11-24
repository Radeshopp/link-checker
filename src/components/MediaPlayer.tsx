import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from './ui/use-toast';

interface MediaPlayerProps {
  url: string;
  onClose: () => void;
}

export const MediaPlayer = ({ url, onClose }: MediaPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = () => {
      if (url.toLowerCase().includes('.m3u8')) {
        // HLS stream
        if (Hls.isSupported()) {
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(error => {
              toast({
                title: "Playback Error",
                description: "Unable to autoplay video. Please click play.",
                variant: "destructive",
              });
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              toast({
                title: "Stream Error",
                description: "Failed to load the stream. Please try again.",
                variant: "destructive",
              });
              hls.destroy();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = url;
          video.addEventListener('loadedmetadata', () => {
            video.play().catch(error => {
              console.error('Playback error:', error);
            });
          });
        }
      } else {
        // Regular video formats (MP4, etc.)
        video.src = url;
        video.play().catch(error => {
          console.error('Playback error:', error);
        });
      }
    };

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (video) {
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [url]);

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Now Playing</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            playsInline
            controlsList="nodownload"
          >
            Your browser does not support video playback.
          </video>
        </div>
      </CardContent>
    </Card>
  );
};