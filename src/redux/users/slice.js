import { createSlice } from "@reduxjs/toolkit";
import { logOut } from "../auth/operations";
import {
  fetchUserById,
  fetchCurrentUser,
  fetchUserRecipes,
  fetchUserRecipesById,
  fetchUserFavorites,
  deleteOwnRecipe,
  fetchFollowers,
  fetchFollowing,
  fetchFollowingIds,
  fetchUserRecipesPreview,
  followUser,
  unfollowUser,
  updateAvatar,
} from "./operations";
import { removeFavoriteRecipe } from "../recipes/operations";

const emptyList = {
  data: [],
  page: 1,
  limit: 12,
  totalItems: 0,
  totalPages: 1,
  isLoading: false,
  error: null,
};

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,

  recipes: { ...emptyList },
  favorites: { ...emptyList },

  followers: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  following: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },

  recipesPreview: {},

  followingIds: [],

  followPendingId: null,
  followError: null,

  avatarUploading: false,
  avatarError: null,
};

const setProfilePending = (state) => {
  state.currentUser = null;
  state.isLoading = true;
  state.error = null;
};

const setProfileFulfilled = (state, action) => {
  state.currentUser = action.payload;
  state.isLoading = false;
};

const setProfileRejected = (state, action) => {
  state.currentUser = null;
  state.isLoading = false;
  state.error = action.payload;
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetCurrentUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, setProfilePending)
      .addCase(fetchUserById.fulfilled, setProfileFulfilled)
      .addCase(fetchUserById.rejected, setProfileRejected)
      .addCase(fetchCurrentUser.pending, setProfilePending)
      .addCase(fetchCurrentUser.fulfilled, setProfileFulfilled)
      .addCase(fetchCurrentUser.rejected, setProfileRejected)

      .addCase(fetchUserRecipes.pending, (state) => {
        state.recipes.isLoading = true;
        state.recipes.error = null;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.recipes = { ...action.payload, isLoading: false, error: null };
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.recipes.isLoading = false;
        state.recipes.error = action.payload;
      })
      .addCase(fetchUserRecipesById.pending, (state) => {
        state.recipes.isLoading = true;
        state.recipes.error = null;
      })
      .addCase(fetchUserRecipesById.fulfilled, (state, action) => {
        state.recipes = { ...action.payload, isLoading: false, error: null };
      })
      .addCase(fetchUserRecipesById.rejected, (state, action) => {
        state.recipes.isLoading = false;
        state.recipes.error = action.payload;
      })
      .addCase(deleteOwnRecipe.fulfilled, (state, action) => {
        state.recipes.data = state.recipes.data.filter(
          (recipe) => recipe.id !== action.payload,
        );
        state.recipes.totalItems = Math.max(0, state.recipes.totalItems - 1);
        if (state.currentUser?.recipesCount != null) {
          state.currentUser.recipesCount = Math.max(
            0,
            state.currentUser.recipesCount - 1,
          );
        }
      })

      .addCase(fetchUserFavorites.pending, (state) => {
        state.favorites.isLoading = true;
        state.favorites.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.favorites = { ...action.payload, isLoading: false, error: null };
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.favorites.isLoading = false;
        state.favorites.error = action.payload;
      })
      .addCase(removeFavoriteRecipe.fulfilled, (state, action) => {
        state.favorites.data = state.favorites.data.filter(
          (recipe) => recipe.id !== action.payload,
        );
        state.favorites.totalItems = Math.max(
          0,
          state.favorites.totalItems - 1,
        );
        if (state.currentUser?.favoritesCount != null) {
          state.currentUser.favoritesCount = Math.max(
            0,
            state.currentUser.favoritesCount - 1,
          );
        }
      })

      .addCase(fetchFollowers.pending, (state) => {
        state.followers.isLoading = true;
        state.followers.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers.isLoading = false;
        state.followers.error = null;
        state.followers.data =
          action.payload?.data || action.payload?.followers || [];
        state.followers.totalPages = action.payload?.totalPages || 1;
        state.followers.currentPage = action.payload?.currentPage || 1;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.followers.isLoading = false;
        state.followers.error = action.payload;
      })

      .addCase(fetchFollowing.pending, (state) => {
        state.following.isLoading = true;
        state.following.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following.isLoading = false;
        state.following.error = null;
        state.following.data =
          action.payload?.data || action.payload?.following || [];
        state.following.totalPages = action.payload?.totalPages || 1;
        state.following.currentPage = action.payload?.currentPage || 1;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.following.isLoading = false;
        state.following.error = action.payload;
      })

      .addCase(fetchFollowingIds.fulfilled, (state, action) => {
        state.followingIds = action.payload;
      })

      .addCase(fetchUserRecipesPreview.pending, (state, action) => {
        const userId = action.meta.arg;
        state.recipesPreview[userId] = {
          ...(state.recipesPreview[userId] || {}),
          isLoading: true,
          error: null,
        };
      })
      .addCase(fetchUserRecipesPreview.fulfilled, (state, action) => {
        const { userId, totalItems, recipes } = action.payload;
        state.recipesPreview[userId] = {
          totalItems,
          recipes,
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchUserRecipesPreview.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.recipesPreview[userId] = {
          ...(state.recipesPreview[userId] || {}),
          isLoading: false,
          error: action.payload,
        };
      })

      .addCase(followUser.pending, (state, action) => {
        state.followPendingId = action.meta.arg;
        state.followError = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followPendingId = null;

        const { userId: followedId, me } = action.payload;

        const wasAlreadyFollowing = state.followingIds.includes(followedId);

        if (!wasAlreadyFollowing) {
          state.followingIds.push(followedId);
        }

        const alreadyInList = state.following.data.some(
          (user) => user.id === followedId,
        );

        if (!alreadyInList) {
          const profile =
            state.currentUser?.id === followedId ? state.currentUser : null;
          state.following.data.push({
            id: followedId,
            name: profile?.name ?? null,
            avatar: profile?.avatar ?? null,
          });
        }

        if (wasAlreadyFollowing) {
          return;
        }

        if (state.currentUser?.id === followedId) {
          if (state.currentUser.followersCount != null) {
            state.currentUser.followersCount += 1;
          }
          if (
            me?.id &&
            !state.followers.data.some((user) => user.id === me.id)
          ) {
            state.followers.data.push({
              id: me.id,
              name: me.name,
              avatar: me.avatar,
            });
          }
        } else if (state.currentUser?.followingCount != null) {
          state.currentUser.followingCount += 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followPendingId = null;
        state.followError = action.payload;
      })
      .addCase(unfollowUser.pending, (state, action) => {
        state.followPendingId = action.meta.arg;
        state.followError = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followPendingId = null;

        const { userId: unfollowedId, me } = action.payload;
        const wasFollowing = state.followingIds.includes(unfollowedId);

        state.followingIds = state.followingIds.filter(
          (id) => id !== unfollowedId,
        );
        state.following.data = state.following.data.filter(
          (user) => user.id !== unfollowedId,
        );

        if (!wasFollowing) {
          return;
        }

        if (state.currentUser?.id === unfollowedId) {
          if (state.currentUser.followersCount != null) {
            state.currentUser.followersCount = Math.max(
              0,
              state.currentUser.followersCount - 1,
            );
          }
          if (me?.id) {
            state.followers.data = state.followers.data.filter(
              (user) => user.id !== me.id,
            );
          }
        } else if (state.currentUser?.followingCount != null) {
          state.currentUser.followingCount = Math.max(
            0,
            state.currentUser.followingCount - 1,
          );
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followPendingId = null;
        state.followError = action.payload;
      })

      .addCase(updateAvatar.pending, (state) => {
        state.avatarUploading = true;
        state.avatarError = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.avatarUploading = false;
        if (state.currentUser) {
          state.currentUser.avatar = action.payload;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.avatarUploading = false;
        state.avatarError = action.payload;
      })
      .addCase(logOut.fulfilled, () => {
        return initialState;
      });
  },
});

export const { resetCurrentUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
