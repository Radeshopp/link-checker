import { CheckResult } from "@/lib/checkLink";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ResponseDetailsProps {
  result: CheckResult;
}

export const ResponseDetails = ({ result }: ResponseDetailsProps) => {
  const isSuccess = result.status >= 200 && result.status < 300;
  const isError = result.status >= 400 || result.status === 0;

  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono break-all">{result.url}</p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSuccess
                ? "bg-success/10 text-success"
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
          <div>
            <p className="text-sm text-gray-500">Response Time</p>
            <p className="font-medium">{result.responseTime}ms</p>
          </div>

          {result.error ? (
            <div>
              <p className="text-sm text-gray-500">Error</p>
              <p className="text-destructive font-medium">{result.error}</p>
            </div>
          ) : (
            <div>
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