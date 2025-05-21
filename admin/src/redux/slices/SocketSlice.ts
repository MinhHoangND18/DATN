// socketSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { initializeSocket, disconnectSocket as socketDisconnect } from './socketService';

const SocketSlice = createSlice({
  name: 'socket',
  initialState: {
    connected: false,
  },
  reducers: {
    initSocket: state => {
      // const socket = initializeSocket();
      // if (socket) {
      //   socket.on('connect', () => {
      //     state.connected = true;
      //   });
      //   socket.on('disconnect', () => {
      //     state.connected = false;
      //   });
      // }
    },
    disconnectSocket: state => {
      socketDisconnect();
      state.connected = false;
    },
  },
});

export const { initSocket, disconnectSocket } = SocketSlice.actions;

export default SocketSlice.reducer;
