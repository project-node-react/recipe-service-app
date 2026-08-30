import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import defaultAvatar from "../../assets/profile.png";
import style from "./UserBar.module.css";

export default function UserBar({ onLogOut }) {
	const user = useSelector(selectUser);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState(null);
	const userBarRef = useRef(null);

	useEffect(() => {
		if (!isDropdownOpen || !userBarRef.current) return;

		const rect = userBarRef.current.getBoundingClientRect();
		setDropdownPosition({
			top: rect.bottom + window.scrollY + 8,
			left: rect.left + window.scrollX,
			width: rect.width,
		});
	}, [isDropdownOpen]);

	useEffect(() => {
		if (!isDropdownOpen) return;

		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isDropdownOpen]);

	const handleBackdropClick = (event) => {
		event.stopPropagation();
		setIsDropdownOpen(false);
	};

	return (
		<div
			className={style.user_bar}
			onClick={() => setIsDropdownOpen((prev) => !prev)}
			role="presentation"
			ref={userBarRef}
		>
			<div className={style.user_bar__action}>
				<img
					className={style.user_bar__avatar}
					src={user?.avatar || user?.avatarURL || defaultAvatar}
					alt={user?.name || "User avatar"}
					loading="lazy"
					decoding="async"
					onError={(event) => {
						event.currentTarget.onerror = null;
						event.currentTarget.src = defaultAvatar;
					}}
				/>

				<p className={style.user_bar__name}>{user?.name}</p>

				<svg
					className={clsx(
						style.user_bar__chevron,
						isDropdownOpen && style.chevron_up,
					)}
					aria-hidden="true"
				>
					<use href={`${import.meta.env.BASE_URL}icons.svg#chevron-down`} />
				</svg>
			</div>

			{isDropdownOpen &&
				dropdownPosition &&
				createPortal(
					<>
						<div
							className={style.backdrop}
							onClick={handleBackdropClick}
							role="presentation"
						/>

						<ul
							className={style.dropdown}
							style={{
								top: dropdownPosition.top,
								left: dropdownPosition.left,
								width: dropdownPosition.width,
							}}
						>
							<li>
								<Link
									to={`/user/${user.id}`}
									className={style.dropdown__item}
									onClick={(event) => {
										event.stopPropagation();
										setIsDropdownOpen(false);
									}}
								>
									Profile
								</Link>
							</li>
							<li>
								<button
									type="button"
									className={style.dropdown__item}
									onClick={(event) => {
										event.stopPropagation();
										setIsDropdownOpen(false);
										onLogOut();
									}}
								>
									Log out
									<svg className={style.dropdown__icon} aria-hidden="true">
										<use
											href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right`}
										/>
									</svg>
								</button>
							</li>
						</ul>
					</>,
					document.body,
				)}
		</div>
	);
}
