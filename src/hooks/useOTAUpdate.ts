import { useState, useCallback } from 'react';
import * as Updates from 'expo-updates';

interface OTAStatus {
  isChecking: boolean;
  isDownloading: boolean;
  updateAvailable: boolean;
  isUpToDate: boolean;
  error: string | null;
}

export function useOTAUpdate() {
  const [status, setStatus] = useState<OTAStatus>({
    isChecking: false,
    isDownloading: false,
    updateAvailable: false,
    isUpToDate: false,
    error: null,
  });

  const checkForUpdates = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isChecking: true, isUpToDate: false, error: null }));
      const updateCheck = await Updates.checkForUpdateAsync();

      if (updateCheck.isAvailable) {
         setStatus(prev => ({ ...prev, isChecking: false, updateAvailable: true, isUpToDate: false }));
         await downloadUpdate();
      } else {
         setStatus(prev => ({ ...prev, isChecking: false, updateAvailable: false, isUpToDate: true }));
      }
    } catch (e: any) {
      console.error(e);
      setStatus(prev => ({ ...prev, isChecking: false, isUpToDate: false, error: e.message || 'Error checking for updates' }));
    }
  }, []);

  const downloadUpdate = async () => {
    try {
      setStatus(prev => ({ ...prev, isDownloading: true, error: null }));
      await Updates.fetchUpdateAsync();
      setStatus(prev => ({ ...prev, isDownloading: false }));
    } catch (e: any) {
      console.error(e);
      setStatus(prev => ({ ...prev, isDownloading: false, error: e.message || 'Error downloading update' }));
    }
  };

  const applyUpdate = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (e: any) {
       setStatus(prev => ({ ...prev, error: e.message || 'Error applying update' }));
    }
  }, []);

  return {
    ...status,
    checkForUpdates,
    applyUpdate
  };
}
