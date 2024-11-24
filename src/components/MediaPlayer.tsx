import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface MediaPlayerProps {
  url: string;
  onClose: () => void;
}

export const MediaPlayer = ({ url, onClose }: MediaPlayerProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Now Playing</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <video
          className="w-full rounded-lg"
          controls
          autoPlay
          key={url}
        >
          <source src={url} type="application/x-mpegURL" />
          Your browser does not support HLS playback.
        </video>
      </CardContent>
    </Card>
  );
};