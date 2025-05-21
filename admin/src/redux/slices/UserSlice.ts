import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { useSelector } from 'react-redux';

import { IRootState } from '../store';
import { IUser } from '@/api/ApiUser';

const initialState: Partial<IUser> = {};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (_, action: PayloadAction<IUser>) => {
      return action.payload;
    },
    logoutUser: () => {
      return initialState;
    },

    reloadUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

const useGetUserRedux = () => {
  return useSelector((state: IRootState) => state.user);
};

// Action creators are generated for each case reducer function
export const { loginUser, logoutUser, reloadUser } = UserSlice.actions;

export { useGetUserRedux };

export default UserSlice.reducer;
