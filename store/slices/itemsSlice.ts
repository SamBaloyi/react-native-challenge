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
    delete: number[];
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastFetched: number | null;
}

const initialState: ItemsState = {
  items: [],
  offlineItems: {
    create: [],
    update: [],
    delete: [],
  },
  status: "idle",
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
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteItem(id);
      return id;
    } catch (error) {
      return rejectWithValue(`Failed to delete items: ${error}`);
    }
  }
);

// Type for offline items that need temporary IDs
interface TempItem extends Omit<Item, "id"> {
  tempId?: string;
}

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // For offline operations
    addOfflineItem: (state, action: PayloadAction<Omit<Item, "id">>) => {
      // For offline items, use a negative integer as a temporary ID
      // This way we can distinguish between real API IDs (positive) and temporary ones (negative)
      const tempId = -Math.floor(Math.random() * 1000000) - 1; // Random negative number
      const newItem = {
        ...action.payload,
        id: tempId,
        tempId: `temp-${Date.now()}`, // Keep track of the original temp ID format for compatibility
      } as Item & { tempId?: string };

      state.offlineItems.create.push(newItem);
      state.items.push(newItem);
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
    deleteOfflineItem: (state, action: PayloadAction<number>) => {
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
