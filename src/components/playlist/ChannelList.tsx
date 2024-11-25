import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Tv2, Radio } from "lucide-react";
import { Channel } from "@/types/channel";
import { Badge } from "@/components/ui/badge";

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  currentUrl?: string;
}

export const ChannelList = ({ channels, onChannelSelect, currentUrl }: ChannelListProps) => {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = useMemo(() => {
    const uniqueGroups = new Set(channels.map(c => c.group).filter(Boolean));
    return Array.from(uniqueGroups);
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !selectedGroup || channel.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [channels, search, selectedGroup]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-primary/10 focus:border-primary/20"
          />
        </div>
        <ScrollArea className="h-12 w-full">
          <div className="flex gap-2 pb-3 px-1">
            <Badge
              variant={!selectedGroup ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedGroup(null)}
            >
              All
            </Badge>
            {groups.map(group => (
              <Badge
                key={group}
                variant={selectedGroup === group ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {filteredChannels.map((channel, index) => (
            <button
              key={index}
              onClick={() => onChannelSelect(channel)}
              className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                channel.url === currentUrl
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-8 h-8 rounded object-cover bg-background/50"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center">
                    {channel.group?.toLowerCase().includes('radio') ? (
                      <Radio className="w-4 h-4 text-primary/60" />
                    ) : (
                      <Tv2 className="w-4 h-4 text-primary/60" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{channel.name}</p>
                  {channel.group && (
                    <p className="text-xs text-muted-foreground truncate">
                      {channel.group}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};