import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Tv2 } from "lucide-react";
import { Channel } from "@/types/channel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChannelListProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  currentUrl?: string;
}

export const ChannelList = ({ channels, onChannelSelect, currentUrl }: ChannelListProps) => {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('groups-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-fade-in">
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          <Input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-primary/10 focus:border-primary/20 transition-all hover:border-primary/30"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 shadow-sm hover:bg-background transition-colors"
            style={{ display: scrollPosition > 0 ? 'block' : 'none' }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div id="groups-container" className="flex gap-2 pb-3 px-1 overflow-x-auto whitespace-nowrap">
            <Badge
              variant={!selectedGroup ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-all duration-200 animate-fade-in"
              onClick={() => setSelectedGroup(null)}
            >
              All
            </Badge>
            {groups.map(group => (
              <Badge
                key={group}
                variant={selectedGroup === group ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-all duration-200 whitespace-nowrap animate-fade-in"
                onClick={() => setSelectedGroup(group)}
              >
                {group}
              </Badge>
            ))}
          </div>
          
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 shadow-sm hover:bg-background transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
          {filteredChannels.map((channel, index) => (
            <div key={index}>
              {index > 0 && <Separator className="my-2 opacity-30" />}
              <button
                onClick={() => onChannelSelect(channel)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] group",
                  channel.url === currentUrl
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-10 h-10 rounded-lg object-cover bg-background/50 transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.className = 'hidden';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Tv2 className="w-5 h-5 text-primary/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate text-sm",
                      channel.url === currentUrl && "text-primary"
                    )}>
                      {channel.name}
                    </p>
                    {channel.group && (
                      <p className="text-xs text-muted-foreground truncate">
                        {channel.group}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};