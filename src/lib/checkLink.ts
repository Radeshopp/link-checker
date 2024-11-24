export interface CheckResult {
  url: string;
  status: number;
  headers: Record<string, string>;
  responseTime: number;
  error?: string;
  isWorking: boolean;
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
      url,
      status: response.status,
      headers,
      responseTime: Math.round(performance.now() - startTime),
      isWorking: response.status >= 200 && response.status < 300
    };
  } catch (error) {
    return {
      url,
      status: 0,
      headers: {},
      responseTime: Math.round(performance.now() - startTime),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      isWorking: false
    };
  }
};

export const checkMultipleLinks = async (urls: string[]): Promise<CheckResult[]> => {
  const uniqueUrls = Array.from(new Set(urls));
  const results = await Promise.all(uniqueUrls.map(url => checkM3U8Link(url)));
  return results;
};