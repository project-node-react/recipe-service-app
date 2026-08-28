import { useRef } from "react";
import { NavLink } from "react-router-dom";
import style from "./TabsList.module.css";

export default function TabsList({ isOwnPage }) {
	const listRef = useRef(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);

	// Прокрутка колесом миші
	const handleWheel = (e) => {
		if (e.deltaY !== 0) {
			e.currentTarget.scrollLeft += e.deltaY;
		}
	};

	// Початок перетягування (Touch / Mouse Down)
	const handleMouseDown = (e) => {
		isDragging.current = true;
		const pageX = e.touches ? e.touches[0].pageX : e.pageX;
		startX.current = pageX - listRef.current.offsetLeft;
		scrollLeft.current = listRef.current.scrollLeft;
	};

	// Рух пальцем / мишею
	const handleMouseMove = (e) => {
		if (!isDragging.current) return;
		const pageX = e.touches ? e.touches[0].pageX : e.pageX;
		const x = pageX - listRef.current.offsetLeft;
		const walk = (x - startX.current) * 1.5; // швидкість скролу
		listRef.current.scrollLeft = scrollLeft.current - walk;
	};

	// Завершення перетягування
	const handleMouseUp = () => {
		isDragging.current = false;
	};

	return (
		<ul
			ref={listRef}
			className={style.TabsList}
			onWheel={handleWheel}
			onTouchStart={handleMouseDown}
			onTouchMove={handleMouseMove}
			onTouchEnd={handleMouseUp}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		>
			<li>
				<NavLink
					to="my-recipes"
					aria-label="to the my-recipes"
					className={({ isActive }) => (isActive ? style.active : "")}
				>
					{isOwnPage ? "My recipes" : "recipes"}
				</NavLink>
			</li>
			{isOwnPage && (
				<li>
					<NavLink
						to="my-favorites"
						aria-label="to the my-favorites"
						className={({ isActive }) => (isActive ? style.active : "")}
					>
						my favorites
					</NavLink>
				</li>
			)}
			<li>
				<NavLink
					to="followers"
					aria-label="to the followers"
					className={({ isActive }) => (isActive ? style.active : "")}
				>
					followers
				</NavLink>
			</li>
			{isOwnPage && (
				<li>
					<NavLink
						to="following"
						aria-label="to the following"
						className={({ isActive }) => (isActive ? style.active : "")}
					>
						following
					</NavLink>
				</li>
			)}
		</ul>
	);
}
