import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

// import RecipePreview from "../RecipePreview/RecipePreview";
// import UserCard from "../UserCard/UserCard";
// import ListPagination from "../ListPagination/ListPagination";

// import {
// 	selectUserRecipes,
// 	selectUserFavorites,
// 	selectFollowers,
// 	selectFollowing,
// } from "../../redux/users/selectors";

// import {
// 	fetchUserRecipes,
// 	fetchUserFavorites,
// 	fetchFollowers,
// 	fetchFollowing,
// } from "../../redux/users/operations";

// import styles from "./ListItems.module.css";

export default function ListItems() {
	const { id: userId } = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const activeTab = pathSegments[pathSegments.length - 1] || "my-recipes";
	console.log(activeTab);

	// const cardVariant =
	// 	activeTab === "followers" || activeTab === "following" ? "user" : "recipe";

	// useEffect(() => {
	// 	if (!userId) return;

	// 	const params = { userId, page: currentPage };

	// 	switch (activeTab) {
	// 		case "my-recipes":
	// 			dispatch(fetchUserRecipes(params));
	// 			break;
	// 		case "my-favorites":
	// 			dispatch(fetchUserFavorites(params));
	// 			break;
	// 		case "followers":
	// 			dispatch(fetchFollowers(params));
	// 			break;
	// 		case "following":
	// 			dispatch(fetchFollowing(params));
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }, [dispatch, userId, activeTab, currentPage]);

	// const recipes = useSelector(selectUserRecipes);
	// const favorites = useSelector(selectUserFavorites);
	// const followers = useSelector(selectFollowers);
	// const following = useSelector(selectFollowing);

	// let currentData = { items: [], totalPages: 1 };
	// if (activeTab === "my-recipes") currentData = recipes || {};
	// if (activeTab === "my-favorites") currentData = favorites || {};
	// if (activeTab === "followers") currentData = followers || {};
	// if (activeTab === "following") currentData = following || {};

	// const items = currentData.items || [];
	// const totalPages = currentData.totalPages || 1;

	// const handlePageChange = (newPage) => {
	// 	setSearchParams({ page: newPage });
	// };

	return (
		<div>
			{/* {items.length === 0 ? (
				<p className={styles.empty}>Нічого не знайдено</p>
			) : (
				<ul className={styles.list}>
					{items.map((item) => (
						<li key={item.id || item._id}>
							{cardVariant === "recipe" ? (
								<RecipePreview recipe={item} />
							) : (
								<UserCard user={item} />
							)}
						</li>
					))}
				</ul>
			)}

			{totalPages > 1 && (
				<ListPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)} */}
		</div>
	);
}
