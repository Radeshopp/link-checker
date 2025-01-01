import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckResult, checkMultipleLinks } from "@/lib/checkLink";
import { ResponseDetails } from "./ResponseDetails";
import { Channel } from "@/types/channel";
import { PlaylistView } from "./playlist/PlaylistView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Link as LinkIcon } from "lucide-react";
import { parseM3U } from "@/lib/m3uParser";
import { MediaPlayer } from "@/components/MediaPlayer";
import { Progress } from "@/components/ui/progress";

export const LinkChecker = () => {
  const [urls, setUrls] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!urls.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one URL",
        variant: "destructive",
      });
      return;
    }

    const linkList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);

    try {
      setIsChecking(true);
      setProgress(0);
      
      // Check if the input is an M3U playlist
      if (linkList[0].toLowerCase().endsWith('.m3u') || linkList[0].toLowerCase().endsWith('.m3u8')) {
        const parsedChannels = await parseM3U(linkList[0]);
        setChannels(parsedChannels);
        if (parsedChannels.length > 0) {
          toast({
            title: "Playlist Loaded",
            description: `Found ${parsedChannels.length} channels`,
          });
        }
      }
      
      const totalLinks = linkList.length;
      let completedLinks = 0;
      
      const checkResults = [];
      for (const url of linkList) {
        const result = await checkMultipleLinks([url]);
        checkResults.push(...result);
        completedLinks++;
        setProgress(Math.round((completedLinks / totalLinks) * 100));
      }
      
      setResults(checkResults);

      toast({
        title: "Check Complete",
        description: `Checked ${checkResults.length} links`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check links",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
      setProgress(0);
    }
  };

  const workingLinks = results.filter((r) => r.isWorking);
  const nonWorkingLinks = results.filter((r) => !r.isWorking);

  const downloadWorkingLinks = () => {
    const content = workingLinks.map((r) => r.url).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "working-links.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Check Multiple Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter URLs to check (one per line)
Supported formats:
- M3U/M3U8 playlists
- TS streams
- MP4 videos
- MP3 audio
- Regular HTTP(S) links"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="min-h-[200px] mb-4 font-mono text-sm"
          />
          <div className="space-y-4">
            {isChecking && (
              <div className="w-full space-y-2">
                <Progress 
                  value={progress} 
                  className="h-2 w-full bg-secondary/20"
                />
                <p className="text-sm text-gray-500 text-center">
                  Checking links... {progress}%
                </p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <Button
                onClick={handleCheck}
                disabled={isChecking}
                className="min-w-[120px] hover:scale-105 transition-transform duration-200"
              >
                {isChecking ? "Checking..." : "Check Links"}
              </Button>
              {workingLinks.length > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadWorkingLinks}
                  className="gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <Download size={16} />
                  Download Working Links
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {channels.length > 0 && (
        <PlaylistView
          channels={channels}
          playingUrl={playingUrl}
          onChannelSelect={(channel) => setPlayingUrl(channel.url)}
          onClose={() => setPlayingUrl(null)}
        />
      )}

      {results.length > 0 && !channels.length && (
        <div className="space-y-6">
          {playingUrl && (
            <MediaPlayer url={playingUrl} onClose={() => setPlayingUrl(null)} />
          )}
          <Tabs defaultValue="working" className="w-full animate-fade-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="working">
                Working Links ({workingLinks.length})
              </TabsTrigger>
              <TabsTrigger value="non-working">
                Non-working Links ({nonWorkingLinks.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="working">
              <Card>
                <CardContent className="pt-6">
                  {workingLinks.map((result, index) => (
                    <ResponseDetails 
                      key={index} 
                      result={result} 
                      onPlay={setPlayingUrl}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="non-working">
              <Card>
                <CardContent className="pt-6">
                  {nonWorkingLinks.map((result, index) => (
                    <ResponseDetails 
                      key={index} 
                      result={result}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};