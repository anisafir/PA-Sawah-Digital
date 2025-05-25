import { createSlice } from '@reduxjs/toolkit';

export const streamSlice = createSlice({
  name: 'streamData',
  initialState: {
    streams: {}, 
  },
  reducers: {
    setStreamData: (state, action) => {
      const { streamId, data } = action.payload;
      state.streams[streamId] = data;
    },

    clearStreamData: (state, action) => {
      const { streamId } = action.payload;
      delete state.streams[streamId];
    },

    clearAllStreams: (state) => {
      state.streams = {};
    },
    
  },
});

export const { setStreamData, clearStreamData, clearAllStreams } = streamSlice.actions;

export default streamSlice.reducer;
