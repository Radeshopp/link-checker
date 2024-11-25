import { Channel } from "@/types/channel";

export const parseM3U = async (url: string): Promise<Channel[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    
    const content = await response.text();
    const lines = content.split('\n');
    const channels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    lines.forEach(line => {
      line = line.trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse channel name and attributes
        const matches = {
          name: line.match(/,(.*)$/)?.[1]?.trim() || 'Unnamed Channel',
          logo: line.match(/tvg-logo="([^"]*)"/)?.[1],
          group: line.match(/group-title="([^"]*)"/)?.[1],
        };
        
        currentChannel = {
          name: matches.name,
          logo: matches.logo,
          group: matches.group,
        };
      } else if (line.startsWith('http')) {
        // This is the channel URL
        if (currentChannel.name) {
          channels.push({
            name: currentChannel.name,
            url: line,
            logo: currentChannel.logo,
            group: currentChannel.group,
          });
        }
        currentChannel = {};
      }
    });

    return channels;
  } catch (error) {
    console.error('Error parsing M3U file:', error);
    return [];
  }
};