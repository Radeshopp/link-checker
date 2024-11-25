interface Channel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export const parseM3U = async (url: string): Promise<Channel[]> => {
  try {
    const response = await fetch(url);
    const content = await response.text();
    const lines = content.split('\n');
    const channels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    lines.forEach(line => {
      line = line.trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse channel name and attributes
        const matches = line.match(/tvg-name="([^"]*)"|tvg-logo="([^"]*)"|group-title="([^"]*)"/g);
        const nameMatch = line.match(/,(.*)$/);
        
        if (nameMatch) {
          currentChannel.name = nameMatch[1].trim();
        }
        
        if (matches) {
          matches.forEach(match => {
            if (match.startsWith('tvg-logo="')) {
              currentChannel.logo = match.slice(10, -1);
            } else if (match.startsWith('group-title="')) {
              currentChannel.group = match.slice(13, -1);
            }
          });
        }
      } else if (line.startsWith('http')) {
        // This is the channel URL
        currentChannel.url = line;
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as Channel);
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