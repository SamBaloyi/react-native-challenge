import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useItems } from '../store/hooks/useItems';
import { RootState, AppDispatch } from '../store';
import { syncOfflineItemsThunk } from '../store/slices/itemsSlice';

interface UseOfflineDataResult {
  isSyncing: boolean;
  lastSynced: Date | null;
  pendingChanges: number;
  syncData: () => Promise<void>;
}

export function useOfflineData(): UseOfflineDataResult {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    fetchItems,
    offlineItems,
    lastFetched,
  } = useItems();
  const { isConnected } = useSelector((state: RootState) => state.network);
  const { syncStatus } = useSelector((state: RootState) => state.items);
  
  const [lastSynced, setLastSynced] = useState<Date | null>(
    lastFetched ? new Date(lastFetched) : null
  );

  // Calculate number of pending changes
  const pendingChanges = 
    offlineItems.create.length + 
    offlineItems.update.length + 
    offlineItems.delete.length;

  // Function to manually sync pending changes with the server
  const syncData = async () => {
    if (!isConnected || syncStatus === "syncing") return;
    
    try {
      // Use our thunk that handles the actual syncing logic
      await dispatch(syncOfflineItemsThunk());
      
      // Fetch latest data after sync
      await fetchItems();
      
      if (lastFetched) {
        setLastSynced(new Date(lastFetched));
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return {
    isSyncing: syncStatus === "syncing",
    lastSynced,
    pendingChanges,
    syncData,
  };
}