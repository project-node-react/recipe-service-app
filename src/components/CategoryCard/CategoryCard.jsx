import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters } from "../../redux/recipes/slice";
import style from "./CategoryCard.module.css";

export default function CategoryCard({ category }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClick = () => {
		dispatch(setFilters({ category: category.id }));
		navigate(`/recipes/${category.id}`);
	};

	return (
		<div className={style.card}>
			<img className={style.image} src={category.img} alt={category.name} />

			<div className={style.overlay} />

			<div className={style.content}>
				<span className={style.name}>{category.name}</span>

				<button
					type="button"
					className={style.button}
					onClick={handleClick}
					aria-label={`Open ${category.name} recipes`}
				>
					<svg
						className={style.icon}
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M5.25 12.75L12.75 5.25M12.75 5.25H7.125M12.75 5.25V10.875"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
