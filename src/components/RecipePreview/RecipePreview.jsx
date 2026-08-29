import { Link } from "react-router-dom";
import style from "./RecipePreview.module.css";

export default function RecipePreview({
	recipe,
	onRemove,
	removePending,
	showRemove = true,
}) {
	const { id, title, description, thumb } = recipe;

	return (
		<article className={style.card}>
			<img
				className={style.image}
				src={thumb || "/foodicon.svg"}
				alt={title}
				loading="lazy"
			/>

			<div className={style.info}>
				<h3 className={style.title}>{title}</h3>
				{description ? (
					<p className={style.description}>{description}</p>
				) : null}
			</div>

			<div className={style.actions}>
				<Link
					className={style.action}
					to={`/recipe/${id}`}
					aria-label={`Open recipe ${title}`}
				>
					<svg className={style.icon} aria-hidden="true">
						<use
							href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right1`}
						/>
					</svg>
				</Link>

				{showRemove && (
					<button
						type="button"
						className={style.action}
						onClick={() => onRemove?.(id)}
						disabled={removePending}
						aria-label={`Remove recipe ${title}`}
					>
						<svg className={style.icon} aria-hidden="true">
							<use href={`${import.meta.env.BASE_URL}icons.svg#trash`} />
						</svg>
					</button>
				)}
			</div>
		</article>
	);
}
