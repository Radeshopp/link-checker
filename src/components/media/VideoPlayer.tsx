import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useToast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  url: string;
  onError?: (error: string) => void;
}

export const VideoPlayer = ({ url, onError }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = () => {
      const isHLS = url.toLowerCase().includes('.m3u8');
      const isTS = url.toLowerCase().includes('.ts');
      
      if ((isHLS || isTS) && Hls.isSupported()) {
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
          video.play().catch(() => {
            toast({
              title: "Playback Error",
              description: "Unable to autoplay video. Please click play.",
              variant: "destructive",
            });
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            onError?.(data.details);
            toast({
              title: "Stream Error",
              description: "Failed to load the stream. Please try again.",
              variant: "destructive",
            });
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.error('Playback error:', error);
          });
        });
      } else {
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
  );
};