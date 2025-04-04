import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { setNetworkStatus } from '../slices/networkSlice';
import { RootState, AppDispatch } from '../index';
import { syncOfflineItemsThunk } from '../slices/itemsSlice';

export const useNetwork = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected } = useSelector((state: RootState) => state.network);
  const { offlineItems, syncStatus } = useSelector((state: RootState) => state.items);

  // Only dealing with network status change
  useEffect(() => {
    let lastConnectionStatus = isConnected;
    
    const unsubscribe = NetInfo.addEventListener((state) => {
      const currentlyConnected = state.isConnected ?? false;
      
      // Only dispatch network change if it actually changed
      if (currentlyConnected !== lastConnectionStatus) {
        dispatch(setNetworkStatus(currentlyConnected));
        lastConnectionStatus = currentlyConnected;
        
        // If we just reconnected and there are pending offline items
        if (currentlyConnected && 
            (offlineItems.create.length > 0 || 
             offlineItems.update.length > 0 || 
             offlineItems.delete.length > 0) &&
            syncStatus !== "syncing") {
          dispatch(syncOfflineItemsThunk());
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, isConnected, offlineItems, syncStatus]);

  return { 
    isConnected,
    isSyncing: syncStatus === "syncing"
  };
};