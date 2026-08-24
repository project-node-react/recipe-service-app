export const selectIsLoggedIn = (state) => state.auth.accessToken;

export const selectUser = (state) => state.auth.user;

export const selectIsRefreshing = (state) => state.auth.isRefreshing;
