// hooks/useOfflineData.ts
import { useEffect, useState } from 'react';
import { useItems } from '../store/hooks/useItems';
import { useNetwork } from '../store/hooks/useNetwork';

interface UseOfflineDataResult {
  isSyncing: boolean;
  lastSynced: Date | null;
  pendingChanges: number;
  syncData: () => Promise<void>;
}

export function useOfflineData(): UseOfflineDataResult {
  const { isConnected } = useNetwork();
  const { 
    fetchItems,
    offlineItems,
    lastFetched,
  } = useItems();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(
    lastFetched ? new Date(lastFetched) : null
  );

  // Calculate number of pending changes
  const pendingChanges = 
    offlineItems.create.length + 
    offlineItems.update.length + 
    offlineItems.delete.length;

  // Sync data when coming back online
  useEffect(() => {
    if (isConnected && pendingChanges > 0) {
      syncData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Function to sync pending changes with the server
  const syncData = async () => {
    if (!isConnected || isSyncing) return;
    
    try {
      setIsSyncing(true);
      
      // In a real app, you would implement the logic to:
      // 1. Send all pending creates
      // 2. Send all pending updates
      // 3. Send all pending deletes
      // 4. Fetch latest data from the server
      
      // For now, just fetch the latest data
      await fetchItems();
      
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    lastSynced,
    pendingChanges,
    syncData,
  };
}