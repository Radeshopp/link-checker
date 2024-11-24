import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CheckResult, checkM3U8Link } from "@/lib/checkLink";
import { ResponseDetails } from "./ResponseDetails";

export const LinkChecker = () => {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChecking(true);
      const checkResult = await checkM3U8Link(url);
      setResult(checkResult);

      if (checkResult.error) {
        toast({
          title: "Error",
          description: checkResult.error,
          variant: "destructive",
        });
      } else if (checkResult.status >= 200 && checkResult.status < 300) {
        toast({
          title: "Success",
          description: "Link is valid and accessible",
          variant: "default",
        });
      } else {
        toast({
          title: "Warning",
          description: `Received status code: ${checkResult.status}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex gap-4">
        <Input
          type="url"
          placeholder="Enter M3U8 URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleCheck}
          disabled={isChecking}
          className="min-w-[100px]"
        >
          {isChecking ? (
            <div className="loading-spinner" />
          ) : (
            "Check"
          )}
        </Button>
      </div>

      {result && <ResponseDetails result={result} />}
    </div>
  );
};