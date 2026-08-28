import { NavLink } from "react-router-dom";

import style from "./TabsList.module.css";

export default function TabsList({ isOwnPage }) {
	return (
		<ul className={style.TabsList}>
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
