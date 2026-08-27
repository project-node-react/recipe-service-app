import { useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Logo from "../Logo/Logo";
import { Navigation } from "../Navigation/Navigation";
import AuthBar from "../AuthBar/AuthBar";
import UserBar from "../UserBar/UserBar";
import SignInModal from "../SignInModal/SignInModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import LogOutModal from "../LogOutModal/LogOutModal";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { useLocation } from "react-router-dom";

import style from "./Header.module.css";

export default function Header() {
	const { pathname } = useLocation();
	const isHomePage = pathname === "/";
	const isLoggedIn = useSelector(selectIsLoggedIn);

	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);
	const [isLogOutOpen, setIsLogOutOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const onShowMobileMenu = () => setIsMobileMenuOpen(true);
	const onHideMobileMenu = () => setIsMobileMenuOpen(false);

	const handleProtectedClick = (e) => {
		if (!isLoggedIn) {
			e.preventDefault();
			setIsSignInOpen(true);
		}
	};

	return (
		<>
			<header className={style.header}>
				<Logo
					className={clsx(
						style.header__logo,
						!isHomePage && style.header__logo__rev,
					)}
				/>

				<div className={style.header__nav}>
					<Navigation onProtectedClick={handleProtectedClick} />
				</div>

				{isLoggedIn ? (
					<>
						<UserBar onLogOut={() => setIsLogOutOpen(true)} />

						<button
							type="button"
							className={style.burger}
							onClick={onShowMobileMenu}
							aria-label="Open menu"
						>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</button>
					</>
				) : (
					<AuthBar
						activeModal={isSignInOpen ? "signin" : isSignUpOpen ? "signup" : ""}
						onSignIn={() => setIsSignInOpen(true)}
						onSignUp={() => setIsSignUpOpen(true)}
					/>
				)}
			</header>

			<SignInModal
				isOpen={isSignInOpen}
				onClose={() => setIsSignInOpen(false)}
				onCreateAccount={() => {
					setIsSignInOpen(false);
					setIsSignUpOpen(true);
				}}
			/>
			<SignUpModal
				isOpen={isSignUpOpen}
				onClose={() => setIsSignUpOpen(false)}
				onSignInAccount={() => {
					setIsSignInOpen(true);
					setIsSignUpOpen(false);
				}}
			/>
			<LogOutModal
				isOpen={isLogOutOpen}
				onClose={() => setIsLogOutOpen(false)}
			/>

			<div
				className={clsx(
					style.mobile_menu,
					isMobileMenuOpen && style.mobile_menu__open,
				)}
			>
				<div className={style.mobile_menu__header} onClick={onHideMobileMenu}>
					<Logo className={style.header__logo} />

					<button
						type="button"
						className={style.mobile_menu__close_btn}
						onClick={onHideMobileMenu}
						aria-label="Close menu"
					>
						<span></span>
						<span></span>
					</button>
				</div>

				<div className={style.mobile_menu__nav}>
					<Navigation
						className={style.mobile_menu__nav_list}
						onNavigate={onHideMobileMenu}
						onProtectedClick={handleProtectedClick}
					/>
				</div>
			</div>
		</>
	);
}
