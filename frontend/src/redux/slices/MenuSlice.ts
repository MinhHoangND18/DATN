import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { IRootState } from "../store";

interface IMenuState {
  isOpen: boolean;
}

const initialState: IMenuState = {
  isOpen: true,
};

const MenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isOpen = true;
    },
    closeMenu: (state) => {
      state.isOpen = false;
    },
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

const useGetMenuState = () => {
  return useSelector((state: IRootState) => state.menu.isOpen);
};

// Action creators are generated for each case reducer function
export const { openMenu, closeMenu, toggleMenu } = MenuSlice.actions;

export { useGetMenuState };

export default MenuSlice.reducer;
