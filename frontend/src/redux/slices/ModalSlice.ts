import React from 'react';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import store, { IRootState } from '../store';

export interface IModalOptions {
  className?: string;
  title?: string;
  width?: number | string;
  centered?: boolean;
  afterClosed?: () => void;
}

export interface IModalDetail {
  content: React.ReactNode;
  modalId: number;
  options?: IModalOptions;
}

export interface IInitialState {
  modalList: IModalDetail[];
}

interface IOpenModalProps {
  content: React.ReactNode;
  options?: IModalOptions;
}

const initialState: IInitialState = {
  modalList: [],
};

const ModalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    addModal: (state, action: PayloadAction<IModalDetail>) => {
      state.modalList.push(action.payload);
    },
    removeModal: (state) => {
      state.modalList.pop();
    },
    removeAllModal: (state) => {
      state.modalList = initialState.modalList;
    },
  },
});

const useGetModalList = () => {
  return useSelector((state: IRootState) => state.modal.modalList);
};

const useRemoveAllModal = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(removeAllModal());
  };
};

const openModal = (props: IOpenModalProps) => {
  const modalList = store.getState().modal.modalList;
  store.dispatch(addModal({ ...props, modalId: modalList.length }));
};

export const { addModal, removeAllModal, removeModal } = ModalSlice.actions;

export { useGetModalList, openModal, useRemoveAllModal };

export default ModalSlice.reducer;
