import { useEffect } from 'react';

export const useScreenOrientation = (videoElement: HTMLVideoElement | null) => {
  useEffect(() => {
    if (!videoElement) return;

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        try {
          const screenOrientation = (screen as any).orientation;
          if (screenOrientation?.lock) {
            screenOrientation.lock('landscape').catch(() => {});
          }
        } catch (error) {}
      } else {
        try {
          const screenOrientation = (screen as any).orientation;
          if (screenOrientation?.unlock) {
            screenOrientation.unlock();
          }
        } catch (error) {}
      }
    };

    videoElement.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      videoElement.removeEventListener('fullscreenchange', handleFullscreenChange);
      try {
        const screenOrientation = (screen as any).orientation;
        if (screenOrientation?.unlock) {
          screenOrientation.unlock();
        }
      } catch (error) {}
    };
  }, [videoElement]);
};