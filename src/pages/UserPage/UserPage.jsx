import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { Outlet } from "react-router-dom";

import Container from "../../components/Container/Container";
import { PathInfo } from "../../components/PathInfo/PathInfo";
import { Subtitle } from "../../components/Subtitle/Subtitle";
import { MainTitle } from "../../components/MainTitle/MainTitle";

import styles from "./UserPage.module.css";
import { selectCurrentUser } from "../../redux/users/selectors";
import { fetchUserById } from "../../redux/users/operations";
import TabsList from "../../components/TabsList/TabsList";

const UserPage = () => {
	const { id: userId } = useParams();
	const dispatch = useDispatch();

	const user = useSelector(selectCurrentUser);

	useEffect(() => {
		if (!userId?.trim()) {
			return;
		}

		dispatch(fetchUserById(userId));
	}, [dispatch, userId]);

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

				{/* <UserInfo user={user} /> */}
				{/* <Logut />
				<Follow /> */}

				<TabsList />

				{/* <Outlet context={user} /> */}
			</Container>
		</div>
	);
};

export default UserPage;
