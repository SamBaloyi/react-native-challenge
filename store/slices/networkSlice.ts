import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NetworkState {
  isConnected: boolean;
}

const initialState: NetworkState = {
  isConnected: true,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setNetworkStatus } = networkSlice.actions;
export default networkSlice.reducer;