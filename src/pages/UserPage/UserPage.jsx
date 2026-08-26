import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";

import Container from "../../components/Container/Container";
import { PathInfo } from "../../components/PathInfo/PathInfo";
import { Subtitle } from "../../components/Subtitle/Subtitle";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import TabsList from "../../components/TabsList/TabsList";
import UserInfo from "../../components/UserInfo/UserInfo";
import LogOutModal from "../../components/LogOutModal/LogOutModal";

import styles from "./UserPage.module.css";
import { selectCurrentUser } from "../../redux/users/selectors";
import {
	fetchCurrentUser,
	fetchUserById,
	fetchFollowing,
} from "../../redux/users/operations";
import { resetCurrentUser } from "../../redux/users/slice";
import { selectUser } from "../../redux/auth/selectors";

const UserPage = () => {
	const { id: userId } = useParams();
	const dispatch = useDispatch();

	const authUser = useSelector(selectUser);
	const user = useSelector(selectCurrentUser);

	const [isLogOutOpen, setIsLogOutOpen] = useState(false);

	const isOwnPage = Boolean(
		authUser?.id && String(authUser.id) === String(userId),
	);

	// /users/:id не віддає favoritesCount/followingCount — на своєму профілі
	// потрібен саме /users/current, де ці поля є.
	useEffect(() => {
		if (!userId?.trim()) {
			return;
		}

		dispatch(isOwnPage ? fetchCurrentUser() : fetchUserById(userId));

		return () => {
			dispatch(resetCurrentUser());
		};
	}, [dispatch, userId, isOwnPage]);

	// Список "моїх підписок" потрібен завжди на цій сторінці — і щоб знати
	// стан кнопки Follow/Unfollow в UserInfo на чужому профілі, і пізніше
	// для карток UserCard на вкладках Followers/Following.
	useEffect(() => {
		dispatch(fetchFollowing());
	}, [dispatch]);

	return (
		<div className={styles.page}>
			<Container>
				<div className={styles.pathInfo}>
					<PathInfo currentPage="profile" />
				</div>

				<MainTitle>profile</MainTitle>
				<Subtitle>
					Reveal your culinary art, share your favorite recipe and create
					gastronomic masterpieces with us.
				</Subtitle>

				<div className={styles.layout}>
					<UserInfo
						user={user}
						isOwnPage={isOwnPage}
						onLogOutClick={() => setIsLogOutOpen(true)}
					/>

					<div className={styles.content}>
						<TabsList isOwnPage={isOwnPage} />
						<Outlet />
					</div>
				</div>
			</Container>

			<LogOutModal
				isOpen={isLogOutOpen}
				onClose={() => setIsLogOutOpen(false)}
			/>
		</div>
	);
};

export default UserPage;
