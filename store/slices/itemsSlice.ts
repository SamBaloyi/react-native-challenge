import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from "../../types/item";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../services/itemsApi";

interface ItemsState {
  items: Item[];
  offlineItems: {
    create: Item[];
    update: Item[];
    delete: string[];
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  syncStatus: "idle" | "syncing" | "succeeded" | "failed";
  error: string | null;
  lastFetched: number | null;
}

// Update initialState
const initialState: ItemsState = {
  items: [],
  offlineItems: {
    create: [],
    update: [],
    delete: [],
  },
  status: "idle",
  syncStatus: "idle",
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchItemsThunk = createAsyncThunk(
  "items/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchItems();
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch items: ${error}`);
    }
  }
);

export const createItemThunk = createAsyncThunk(
  "items/createItem",
  async (item: Omit<Item, "id">, { rejectWithValue }) => {
    try {
      const response = await createItem(item);
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to create items: ${error}`);
    }
  }
);

export const updateItemThunk = createAsyncThunk(
  "items/updateItem",
  async (item: Item, { rejectWithValue }) => {
    try {
      const response = await updateItem(item);
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to update items: ${error}`);
    }
  }
);

export const deleteItemThunk = createAsyncThunk(
  "items/deleteItem",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(`Failed to delete items: ${error}`);
    }
  }
);

export const syncOfflineItemsThunk = createAsyncThunk(
  "items/syncOfflineItems",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { items: ItemsState };
      const { offlineItems } = state.items;

      // Track IDs that need to be replaced in local state
      const tempToRealIdMap = new Map<string, string>();

      // Process create operations
      for (const item of offlineItems.create) {
        // Remove temporary ID and create real item
        const { id: tempId, ...itemData } = item;
        const result = await dispatch(createItemThunk(itemData)).unwrap();

        // Store mapping from temp ID to real ID for later replacement
        if (tempId.startsWith("temp-")) {
          tempToRealIdMap.set(tempId, result.id);
        }
      }

      // Process update operations - but filter out any with temp IDs that were just created
      const updatesWithRealIds = offlineItems.update.filter(
        (item) =>
          !item.id.startsWith("temp-") ||
          !offlineItems.create.some((createItem) => createItem.id === item.id)
      );

      for (const item of updatesWithRealIds) {
        await dispatch(updateItemThunk(item));
      }

      // Process delete operations - but filter out temp IDs
      const deletesWithRealIds = offlineItems.delete.filter(
        (id) => !id.startsWith("temp-")
      );

      for (const id of deletesWithRealIds) {
        await dispatch(deleteItemThunk(id));
      }

      // Clear the offline queue after successful sync
      dispatch(syncOfflineItems());

      // Return the temp to real ID mapping for possible UI updates
      return {
        success: true,
        tempToRealIdMap: Object.fromEntries(tempToRealIdMap),
      };
    } catch (error) {
      return rejectWithValue(`Failed to sync offline items: ${error}`);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // For offline operations
    addOfflineItem: (state, action: PayloadAction<Omit<Item, "id">>) => {
      const newItem = {
        ...action.payload,
        id: `temp-${Date.now()}`, // Temporary ID until synced
      };
      state.offlineItems.create.push(newItem as Item);
      state.items.push(newItem as Item);
    },
    updateOfflineItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
        state.offlineItems.update.push(action.payload);
      }
    },
    deleteOfflineItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.offlineItems.delete.push(action.payload);
    },
    syncOfflineItems: (state) => {
      // Reset offline items after sync
      state.offlineItems = {
        create: [],
        update: [],
        delete: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItemsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchItemsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createItemThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItemThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItemThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(syncOfflineItemsThunk.pending, (state) => {
        state.syncStatus = "syncing";
      })
      .addCase(syncOfflineItemsThunk.fulfilled, (state) => {
        state.syncStatus = "succeeded";
      })
      .addCase(syncOfflineItemsThunk.rejected, (state, action) => {
        state.syncStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  addOfflineItem,
  updateOfflineItem,
  deleteOfflineItem,
  syncOfflineItems,
} = itemsSlice.actions;
export default itemsSlice.reducer;
