// store/hooks/useItems.ts
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../index";
import {
  fetchItemsThunk,
  createItemThunk,
  updateItemThunk,
  deleteItemThunk,
  addOfflineItem,
  updateOfflineItem,
  deleteOfflineItem,
} from "../slices/itemsSlice";
import { Item } from "../../types/item";

export const useItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, lastFetched, offlineItems } = useSelector(
    (state: RootState) => state.items
  );
  const { isConnected } = useSelector((state: RootState) => state.network);

  const fetchItems = useCallback(() => {
    if (isConnected) {
      return dispatch(fetchItemsThunk());
    }
    return Promise.resolve();
  }, [dispatch, isConnected]);

  const createItem = useCallback(
    (item: Omit<Item, "id">) => {
      if (isConnected) {
        return dispatch(createItemThunk(item));
      } else {
        dispatch(addOfflineItem(item));
        return Promise.resolve();
      }
    },
    [dispatch, isConnected]
  );

  const updateItem = useCallback(
    (item: Item) => {
      if (isConnected) {
        return dispatch(updateItemThunk(item));
      } else {
        dispatch(updateOfflineItem(item));
        return Promise.resolve();
      }
    },
    [dispatch, isConnected]
  );

  const deleteItem = useCallback(
    (id: string) => {
      if (isConnected) {
        return dispatch(deleteItemThunk(id));
      } else {
        dispatch(deleteOfflineItem(id));
        return Promise.resolve();
      }
    },
    [dispatch, isConnected]
  );

  return {
    items,
    status,
    error,
    lastFetched,
    offlineItems,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
