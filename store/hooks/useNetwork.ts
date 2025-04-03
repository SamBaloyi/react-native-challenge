import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { setNetworkStatus } from '../slices/networkSlice';
import { RootState, AppDispatch } from '../index';
import { syncOfflineItems } from '../slices/itemsSlice';

export const useNetwork = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isConnected } = useSelector((state: RootState) => state.network);
  const { offlineItems } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setNetworkStatus(state.isConnected ?? false));
      
      // If reconnected and there are offline items pending, sync them
      if (state.isConnected && 
          (offlineItems.create.length > 0 || 
           offlineItems.update.length > 0 || 
           offlineItems.delete.length > 0)) {
        // In a real app, we would implement the sync logic here
        // For now, we'll just mark them as synced
        dispatch(syncOfflineItems());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, offlineItems]);

  return { isConnected };
};