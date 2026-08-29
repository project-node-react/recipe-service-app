import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import RecipePreview from "../RecipePreview/RecipePreview";
import UserCard from "../UserCard/UserCard";
import RecipePagination from "../RecipePagination/RecipePagination";

import {
	selectUserRecipes,
	selectUserFavorites,
	selectFollowers,
	selectFollowing,
} from "../../redux/users/selectors";

import {
	fetchUserRecipes,
	fetchUserRecipesById,
	fetchUserFavorites,
	fetchFollowers,
	fetchFollowing,
	fetchFollowingIds,
	deleteOwnRecipe,
} from "../../redux/users/operations";
import { removeFavoriteRecipe } from "../../redux/recipes/operations";
import { selectUser } from "../../redux/auth/selectors";

import styles from "./ListItems.module.css";

const PAGE_LIMIT = 12;

const getEmptyMessage = (tab, isOwnPage) => {
	switch (tab) {
		case "my-recipes":
			return isOwnPage
				? "Nothing has been added to your recipes list yet. Please browse our recipes and add your favorites for easy access in the future."
				: "This user hasn't added any recipes yet.";
		case "my-favorites":
			return "Nothing has been added to your favorite recipes list yet. Please browse our recipes and add your favorites for easy access in the future.";
		case "followers":
			return isOwnPage
				? "There are currently no followers on your account. Please engage our visitors with interesting content and draw their attention to your profile."
				: "This user has no followers yet.";
		case "following":
			return "Your account currently has no subscriptions to other users. Learn more about our users and select those whose content interests you.";
		default:
			return "Nothing found yet.";
	}
};

export default function ListItems() {
	const { id: userId } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const authUser = useSelector(selectUser);
	const isOwnPage = Boolean(
		authUser?.id && String(authUser.id) === String(userId),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const activeTab = pathSegments[pathSegments.length - 1] || "my-recipes";

	const recipes = useSelector(selectUserRecipes);
	const favorites = useSelector(selectUserFavorites);
	const followers = useSelector(selectFollowers);
	const following = useSelector(selectFollowing);

	useEffect(() => {
		if (!userId) return;

		switch (activeTab) {
			case "my-recipes":
				dispatch(
					isOwnPage
						? fetchUserRecipes({ page: currentPage, limit: PAGE_LIMIT })
						: fetchUserRecipesById({
								userId,
								page: currentPage,
								limit: PAGE_LIMIT,
							}),
				);
				break;
			case "my-favorites":
				dispatch(fetchUserFavorites({ page: currentPage, limit: PAGE_LIMIT }));
				break;
			case "followers":
				dispatch(fetchFollowers({ userId, page: currentPage, limit: PAGE_LIMIT }));
				dispatch(fetchFollowingIds());
				break;
			case "following":
				dispatch(fetchFollowing({ page: currentPage, limit: PAGE_LIMIT }));
				break;
			default:
				break;
		}
	}, [dispatch, userId, isOwnPage, activeTab, currentPage]);

	const isRecipeTab = activeTab === "my-recipes" || activeTab === "my-favorites";
	const isUserTab = activeTab === "followers" || activeTab === "following";
	const showPagination = isRecipeTab || isUserTab;

	const currentData =
		{
			"my-recipes": recipes,
			"my-favorites": favorites,
			followers,
			following,
		}[activeTab] || { data: [], isLoading: false, error: null };

	const items = currentData.data || [];
	const totalPages = currentData.totalPages || 1;
	const isLoading = currentData.isLoading;
	const error = currentData.error;

	const handlePageChange = (nextPage) => {
		setSearchParams({ page: String(nextPage) });
	};

	const handleRemoveRecipe = async (recipeId) => {
		const action =
			activeTab === "my-favorites"
				? removeFavoriteRecipe(recipeId)
				: deleteOwnRecipe(recipeId);

		try {
			await dispatch(action).unwrap();

			if (items.length === 1 && currentPage > 1) {
				setSearchParams({ page: String(currentPage - 1) });
			}
		} catch (error) {
			toast.error(error || "Failed to remove recipe");
		}
	};

	if (isLoading) {
		return (
			<div className={styles.loader}>
				<ClipLoader color="#e44848" size={48} aria-label="Loading" />
			</div>
		);
	}

	if (error) {
		return (
			<p className={styles.error}>
				Failed to load data: {error}. Try refreshing the page.
			</p>
		);
	}

	if (!items.length) {
		return (
			<p className={styles.empty}>{getEmptyMessage(activeTab, isOwnPage)}</p>
		);
	}

	return (
		<div>
			<ul className={styles.list}>
				{items.map((item) => (
					<li className={styles.item} key={item.id}>
						{isRecipeTab ? (
							<RecipePreview
								recipe={item}
								onRemove={handleRemoveRecipe}
								showRemove={isOwnPage}
							/>
						) : (
							<UserCard user={item} />
						)}
					</li>
				))}
			</ul>

			{showPagination && (
				<RecipePagination
					page={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
