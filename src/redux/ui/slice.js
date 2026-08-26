import { createSlice } from "@reduxjs/toolkit";

/*
 * Какая модалка сейчас открыта: null | "signIn" | "signUp" | "logOut".
 * Единое место управления модалками, чтобы SignIn/SignUp могли переключать
 * друг друга, а Hero/RecipeCard/UserBar и т.п. могли открывать SignInModal
 * одним и тем же способом.
 */
const initialState = {
  modal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.modal = payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
