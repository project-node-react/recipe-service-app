export const selectCurrentUser = (state) => state.users.currentUser;
export const selectIsLoading = (state) => state.users.isLoading;
export const selectError = (state) => state.users.error;

export const selectUserRecipes = (state) => state.users.recipes;
export const selectUserFavorites = (state) => state.users.favorites;

export const selectFollowers = (state) => state.users.followers;
export const selectFollowing = (state) => state.users.following;

export const selectFollowPendingId = (state) => state.users.followPendingId;
export const selectFollowError = (state) => state.users.followError;

export const selectIsFollowing = (state, userId) =>
  (state.users.following?.data || []).some((user) => user.id === userId);

export const selectAvatarUploading = (state) => state.users.avatarUploading;
export const selectAvatarError = (state) => state.users.avatarError;

export const selectRecipesPreview = (state, userId) =>
  state.users.recipesPreview[userId];
