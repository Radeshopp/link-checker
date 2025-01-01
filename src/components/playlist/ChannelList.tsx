import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Tv2 } from "lucide-react";
import { Channel } from "@/types/channel";

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  currentUrl?: string;
}

export const ChannelList = ({ channels, onChannelSelect, currentUrl }: ChannelListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Group channels by their group property
  const groupedChannels = channels.reduce((acc, channel) => {
    const group = channel.group || "Ungrouped";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  // Filter channels based on search query
  const filteredGroups = Object.entries(groupedChannels).reduce(
    (acc, [group, channels]) => {
      const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredChannels.length > 0) {
        acc[group] = filteredChannels;
      }
      return acc;
    },
    {} as Record<string, Channel[]>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-2">
          {Object.entries(filteredGroups).map(([group, channels]) => (
            <div key={group} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">
                {group}
              </h3>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Button
                    key={channel.url}
                    variant={currentUrl === channel.url ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => onChannelSelect(channel)}
                  >
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-4 h-4 object-contain"
                      />
                    ) : (
                      <Tv2 className="w-4 h-4" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};