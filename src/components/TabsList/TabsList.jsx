import { NavLink } from "react-router-dom";

import style from "./TabsList.module.css";

export default function TabsList() {
	return (
		<ul className={style.TabsList}>
			<li>
				<NavLink to="my-recipes" aria-label="to the my-recipes">
					Features
				</NavLink>
			</li>
			<li>
				<NavLink to="my-favorites" aria-label="to the campers my-favorites">
					Reviews
				</NavLink>
			</li>
			<li>
				<NavLink to="followers" aria-label="to the followers">
					Features
				</NavLink>
			</li>
			<li>
				<NavLink to="following" aria-label="to the campers following">
					Reviews
				</NavLink>
			</li>
		</ul>
	);
}
