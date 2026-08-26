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
	fetchUserFavorites,
	fetchFollowers,
	fetchFollowing,
	deleteOwnRecipe,
} from "../../redux/users/operations";
import { removeFavoriteRecipe } from "../../redux/recipes/operations";

import styles from "./ListItems.module.css";

const PAGE_LIMIT = 12;

export default function ListItems() {
	const { id: userId } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

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
				dispatch(fetchUserRecipes({ page: currentPage, limit: PAGE_LIMIT }));
				break;
			case "my-favorites":
				dispatch(fetchUserFavorites({ page: currentPage, limit: PAGE_LIMIT }));
				break;
			case "followers":
				dispatch(fetchFollowers(userId));
				break;
			case "following":
				// Дублюємо запит з UserPage навмисно: список має бути свіжим одразу
				// після Follow/Unfollow, зробленого деінде на цій самій сторінці.
				dispatch(fetchFollowing());
				break;
			default:
				break;
		}
	}, [dispatch, userId, activeTab, currentPage]);

	const isRecipeTab = activeTab === "my-recipes" || activeTab === "my-favorites";

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

			// Видалили останній рецепт на не першій сторінці — повертаємось на
			// попередню, а не лишаємось дивитись на порожню.
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

	if (!items.length) {
		return <p className={styles.empty}>Nothing found yet.</p>;
	}

	return (
		<div>
			<ul className={styles.list}>
				{items.map((item) => (
					<li className={styles.item} key={item.id}>
						{isRecipeTab ? (
							<RecipePreview recipe={item} onRemove={handleRemoveRecipe} />
						) : (
							<UserCard user={item} />
						)}
					</li>
				))}
			</ul>

			{isRecipeTab && (
				<RecipePagination
					page={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
