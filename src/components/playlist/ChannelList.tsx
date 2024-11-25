import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Tv2 } from "lucide-react";
import { Channel } from "@/types/channel";

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
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <ScrollArea className="h-10">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                !selectedGroup ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {groups.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedGroup === group ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1 -mx-2">
        <div className="space-y-1 px-2">
          {filteredChannels.map((channel, index) => (
            <button
              key={index}
              onClick={() => onChannelSelect(channel)}
              className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                channel.url === currentUrl
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-8 h-8 rounded object-cover bg-background"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Tv2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{channel.name}</p>
                  {channel.group && (
                    <p className="text-sm text-muted-foreground truncate">
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