export interface CheckResult {
  status: number;
  headers: Record<string, string>;
  responseTime: number;
  error?: string;
}

export const checkM3U8Link = async (url: string): Promise<CheckResult> => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/x-mpegURL'
      }
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      status: response.status,
      headers,
      responseTime: Math.round(performance.now() - startTime)
    };
  } catch (error) {
    return {
      status: 0,
      headers: {},
      responseTime: Math.round(performance.now() - startTime),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};