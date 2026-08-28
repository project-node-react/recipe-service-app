export const selectCurrentUser = (state) => state.users.currentUser;
export const selectIsLoading = (state) => state.users.isLoading;
export const selectError = (state) => state.users.error;

export const selectUserRecipes = (state) => state.users.recipes;
export const selectUserFavorites = (state) => state.users.favorites;

export const selectFollowers = (state) => state.users.followers;
export const selectFollowing = (state) => state.users.following;

export const selectFollowPendingId = (state) => state.users.followPendingId;
export const selectFollowError = (state) => state.users.followError;

// Чи підписаний зараз авторизований користувач на юзера з даним id —
// рахуємо по списку своїх підписок (state.users.following.data).
// Список followers/following інших юзерів не містить прапорця
// "isFollowing" на кожному елементі, тому це доводиться рахувати самим:
// для коректної роботи UserCard список following.data має бути
// заздалегідь підвантажений (dispatch(fetchFollowing()) при вході на
// будь-яку сторінку зі списками юзерів, не тільки на вкладці Following).
export const selectIsFollowing = (state, userId) =>
  state.users.following.data.some((user) => user.id === userId);

export const selectAvatarUploading = (state) => state.users.avatarUploading;
export const selectAvatarError = (state) => state.users.avatarError;
