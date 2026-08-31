import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import CategoryCard from "../CategoryCard/CategoryCard";
import Container from "../../components/Container/Container";
import style from "./CategoryList.module.css";
import { ClipLoader } from "react-spinners";
import { resetRecipesFilters } from "../../redux/recipes/slice";

export default function CategoryList() {
	const dispatch = useDispatch();
	const [showAll, setShowAll] = useState(false);

	useEffect(() => {
		dispatch(resetRecipesFilters());
	}, [dispatch]);

	const {
		items = [],
		isLoading,
		error,
	} = useSelector((state) => state.categories);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			toast.error(`Error: ${error}`);
		}
	}, [error]);

	const sortedCategories = [...items].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	const visibleCategories = showAll
		? sortedCategories
		: sortedCategories.slice(0, 11);

	return (
		<section className={style.section}>
			<Container>
				{isLoading ? (
					<ClipLoader
						color="#1976d2"
						size={25}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				) : (
					<>
						<div className={style.intro}>
							<h2 className={style.title}>Categories</h2>

							<p className={style.description}>
								Discover a limitless world of culinary possibilities and enjoy
								exquisite recipes that combine taste, style and the warm
								atmosphere of the kitchen.
							</p>
						</div>

						<ul className={style.list}>
							{visibleCategories.map((category) => (
								<li key={category.id} className={style.item}>
									<CategoryCard category={category} />
								</li>
							))}

							{!showAll && sortedCategories.length > 11 && (
								<li className={style.item}>
									<button
										type="button"
										className={style.button}
										onClick={() => setShowAll(true)}
									>
										<span>All Categories</span>
									</button>
								</li>
							)}
						</ul>
					</>
				)}
			</Container>
		</section>
	);
}
