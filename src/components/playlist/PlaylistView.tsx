import { Card, CardContent } from "@/components/ui/card";
import { MediaPlayer } from "../media/MediaPlayer";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-2">
        {playingUrl && (
          <MediaPlayer url={playingUrl} onClose={onClose} />
        )}
      </div>
      <Card className="h-[600px] border-2 border-primary/10">
        <CardContent className="h-full p-4">
          <ChannelList
            channels={channels}
            onChannelSelect={onChannelSelect}
            currentUrl={playingUrl || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};