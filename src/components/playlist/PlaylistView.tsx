import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-[1920px] mx-auto">
      <div className="lg:col-span-3 space-y-4">
        {playingUrl && (
          <MediaPlayer url={playingUrl} onClose={onClose} />
        )}
      </div>
      <div className="lg:col-span-1">
        <Card className="h-[calc(100vh-2rem)] border-2 border-primary/5 shadow-lg">
          <CardContent className="h-full p-4">
            <ChannelList
              channels={channels}
              onChannelSelect={onChannelSelect}
              currentUrl={playingUrl || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};