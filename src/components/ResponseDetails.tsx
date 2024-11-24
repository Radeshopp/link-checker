import { CheckResult } from "@/lib/checkLink";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ResponseDetailsProps {
  result: CheckResult;
  onPlay?: (url: string) => void;
}

export const ResponseDetails = ({ result, onPlay }: ResponseDetailsProps) => {
  const isSuccess = result.status >= 200 && result.status < 300;
  const isError = result.status >= 400 || result.status === 0;

  const isPlayable = result.url.toLowerCase().includes('.m3u8') || 
                     result.url.toLowerCase().includes('.mp4') ||
                     result.url.toLowerCase().includes('.mp3');

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-mono break-all">{result.url}</p>
            {isPlayable && isSuccess && onPlay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPlay(result.url)}
                className="hover:scale-110 transition-transform duration-200"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSuccess
                ? "bg-success/10 text-success animate-pulse-scale"
                : isError
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            }`}
          >
            Status: {result.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <div className="space-y-2">
          <div className="animate-fade-in">
            <p className="text-sm text-gray-500">Response Time</p>
            <p className="font-medium">{result.responseTime}ms</p>
          </div>

          {result.error ? (
            <div className="animate-fade-in">
              <p className="text-sm text-gray-500">Error</p>
              <p className="text-destructive font-medium">{result.error}</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <p className="text-sm text-gray-500">Headers</p>
              <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                {Object.entries(result.headers).map(([key, value]) => (
                  <div key={key} className="text-sm mb-1">
                    <span className="font-medium">{key}:</span>{" "}
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};