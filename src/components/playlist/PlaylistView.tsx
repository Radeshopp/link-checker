import { Card } from "@/components/ui/card";
import { MediaPlayer } from "@/components/MediaPlayer";
import { ChannelList } from "./ChannelList";
import { Channel } from "@/types/channel";

interface PlaylistViewProps {
  channels: Channel[];
  playingUrl: string | null;
  onChannelSelect: (channel: Channel) => void;
  onClose: () => void;
}

export const PlaylistView = ({ channels, playingUrl, onChannelSelect, onClose }: PlaylistViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 max-w-[1920px] mx-auto animate-fade-in">
      <div className="lg:col-span-2 space-y-4">
        {playingUrl && (
          <MediaPlayer url={playingUrl} onClose={onClose} />
        )}
      </div>
      <div className="lg:col-span-1 h-full">
        <Card className="h-[calc(100vh-8rem)] border border-primary/10 shadow-lg bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="h-full p-4">
            <ChannelList
              channels={channels}
              onChannelSelect={onChannelSelect}
              currentUrl={playingUrl || undefined}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};