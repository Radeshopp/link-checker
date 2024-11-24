import { CheckResult } from "@/lib/checkLink";

interface ResponseDetailsProps {
  result: CheckResult;
}

export const ResponseDetails = ({ result }: ResponseDetailsProps) => {
  const isSuccess = result.status >= 200 && result.status < 300;
  const isError = result.status >= 400 || result.status === 0;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Response Details</h3>
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

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Response Time</p>
          <p className="font-medium">{result.responseTime}ms</p>
        </div>

        {result.error ? (
          <div>
            <p className="text-sm text-gray-500 mb-1">Error</p>
            <p className="text-destructive font-medium">{result.error}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-1">Headers</p>
            <div className="bg-gray-50 rounded-md p-3 max-h-48 overflow-y-auto">
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
    </div>
  );
};