import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserById,
  fetchCurrentUser,
  fetchUserRecipes,
  fetchUserFavorites,
  deleteOwnRecipe,
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  updateAvatar,
} from "./operations";
// Видалення з улюблених на вкладці My favorites йде через уже готовий
// thunk з redux/recipes (щоб не дублювати виклик DELETE /recipes/:id/favorite),
// але саму картку зі списку users.favorites.data і лічильник currentUser
// прибираємо тут — recipes-слайс про існування users-слайсу нічого не знає.
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
  // Профіль, що зараз відкритий на UserPage (свій або чужий) —
  // приходить або з fetchCurrentUser, або з fetchUserById.
  currentUser: null,
  isLoading: false,
  error: null,

  // My recipes / My favorites — серверна пагінація (page/limit/totalPages).
  recipes: { ...emptyList },
  favorites: { ...emptyList },

  // Followers / Following — бекенд поки без пагінації, тримаємо просто
  // список + isLoading/error. Коли бекенд додасть page/limit — сюди
  // додадуться ті самі поля, що й у recipes/favorites.
  followers: { data: [], isLoading: false, error: null },
  following: { data: [], isLoading: false, error: null },

  // Follow/Unfollow — id користувача, на якого зараз йде запит
  // (щоб задизейблити саме його кнопку, а не всі одразу).
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
      // Профіль (чужий або свій)
      .addCase(fetchUserById.pending, setProfilePending)
      .addCase(fetchUserById.fulfilled, setProfileFulfilled)
      .addCase(fetchUserById.rejected, setProfileRejected)
      .addCase(fetchCurrentUser.pending, setProfilePending)
      .addCase(fetchCurrentUser.fulfilled, setProfileFulfilled)
      .addCase(fetchCurrentUser.rejected, setProfileRejected)

      // My recipes
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

      // My favorites
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
        state.favorites.totalItems = Math.max(0, state.favorites.totalItems - 1);
        if (state.currentUser?.favoritesCount != null) {
          state.currentUser.favoritesCount = Math.max(
            0,
            state.currentUser.favoritesCount - 1,
          );
        }
      })

      // Followers
      .addCase(fetchFollowers.pending, (state) => {
        state.followers.isLoading = true;
        state.followers.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers.data = action.payload;
        state.followers.isLoading = false;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.followers.isLoading = false;
        state.followers.error = action.payload;
      })

      // Following
      .addCase(fetchFollowing.pending, (state) => {
        state.following.isLoading = true;
        state.following.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following.data = action.payload;
        state.following.isLoading = false;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.following.isLoading = false;
        state.following.error = action.payload;
      })

      // Follow / Unfollow
      .addCase(followUser.pending, (state, action) => {
        state.followPendingId = action.meta.arg;
        state.followError = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followPendingId = null;
        if (state.currentUser?.id === action.payload) {
          // підписались просто зі своєї сторінки (малоймовірно, але про всяк)
        }
        if (state.currentUser?.followingCount != null) {
          state.currentUser.followingCount += 1;
        }
        // якщо цей юзер вже в списку "моїх підписок" — не дублюємо чергове
        // додавання в UI-стан; сам список підтягнеться заново при заході
        // на вкладку Following.
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
        if (state.currentUser?.followingCount != null) {
          state.currentUser.followingCount = Math.max(
            0,
            state.currentUser.followingCount - 1,
          );
        }
        // Якщо відписка відбулась зі списку Following (на своїй сторінці) —
        // картка має зникнути без перезавантаження.
        state.following.data = state.following.data.filter(
          (user) => user.id !== action.payload,
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followPendingId = null;
        state.followError = action.payload;
      })

      // Avatar
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
      });
  },
});

export const { resetCurrentUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
