import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import style from "./RecipeCard.module.css";

export default function RecipeCard({
	recipe,
	isFavorite = false,
	isLoggedIn = false,
	onToggleFavorite,
	onAuthRequired,
}) {
	const navigate = useNavigate();
	const { id, title, description, thumb, owner } = recipe;

	const handleAuthorClick = () => {
		if (!isLoggedIn) {
			onAuthRequired?.();
			return;
		}
		navigate(`/user/${owner.id}`);
	};

	const handleFavoriteClick = () => {
		onToggleFavorite?.(id, isFavorite);
	};

	return (
		<article className={style.card}>
			<img
				className={style.image}
				src={thumb || `${import.meta.env.BASE_URL}foodicon.svg`}
				alt={title}
				loading="lazy"
			/>

			<div className={style.section}>
				<div className={style.text}>
					<h3 className={style.title}>{title}</h3>

					{description ? (
						<p className={style.description}>{description}</p>
					) : null}
				</div>

				<div className={style.footer}>
					<button
						type="button"
						className={style.author}
						onClick={handleAuthorClick}
						aria-label={`Author ${owner.name}`}
					>
						<span className={style.avatarWrap}>
							{owner.avatar ? (
								<img className={style.avatar} src={owner.avatar} alt="" />
							) : (
								<span className={style.avatarFallback} aria-hidden="true">
									{owner.name?.charAt(0).toUpperCase()}
								</span>
							)}
						</span>

						<span className={style.authorName}>{owner.name}</span>
					</button>

					<div className={style.actions}>
						<button
							type="button"
							className={clsx(style.action, isFavorite && style.actionActive)}
							onPointerDown={() => {
								// console.log("👆 POINTER DOWN:", title, id);
							}}
							onMouseDown={() => {
								// console.log("🖱️ MOUSE DOWN:", title, id);
							}}
							onClick={(event) => {
								handleFavoriteClick();
							}}
							aria-pressed={isFavorite}
							aria-label={
								isFavorite ? "Remove from favorites" : "Add to favorites"
							}
						>
							<svg
								className={`${style.icon} ${style.iconHeart}`}
								viewBox="0 0 18 18"
								aria-hidden="true"
							>
								<path
									d="M15.6296 3.4574C15.2465 3.07416 14.7917 2.77014 14.2911 2.56272C13.7905 2.3553 13.254 2.24854 12.7121 2.24854C12.1702 2.24854 11.6337 2.3553 11.1331 2.56272C10.6325 2.77014 10.1777 3.07416 9.7946 3.4574L8.9996 4.2524L8.2046 3.4574C7.43083 2.68364 6.38137 2.24894 5.2871 2.24894C4.19283 2.24894 3.14337 2.68364 2.3696 3.4574C1.59583 4.23117 1.16113 5.28063 1.16113 6.3749C1.16113 7.46918 1.59583 8.51864 2.3696 9.2924L3.1646 10.0874L8.9996 15.9224L14.8346 10.0874L15.6296 9.2924C16.0128 8.90934 16.3169 8.45451 16.5243 7.95392C16.7317 7.45333 16.8385 6.91677 16.8385 6.3749C16.8385 5.83304 16.7317 5.29648 16.5243 4.79589C16.3169 4.29529 16.0128 3.84047 15.6296 3.4574Z"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						<button
							type="button"
							className={style.action}
							onClick={() => navigate(`/recipe/${id}`)}
							aria-label={`Open recipe ${title}`}
						>
							<svg
								className={`${style.icon} ${style.iconArrow}`}
								aria-hidden="true"
							>
								<use
									href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right`}
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
