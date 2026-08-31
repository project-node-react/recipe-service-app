import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { refreshUser } from "../../redux/auth/operations";
import { selectIsRefreshing } from "../../redux/auth/selectors";
import style from "./App.module.css";

const Layout = lazy(() => import("../../layouts/Layout/Layout"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const AddRecipePage = lazy(
	() => import("../../pages/AddRecipePage/AddRecipePage"),
);
const RecipePage = lazy(() => import("../../pages/RecipePage/RecipePage"));
const UserPage = lazy(() => import("../../pages/UserPage/UserPage"));
const NotFoundPage = lazy(
	() => import("../../pages/NotFoundPage/NotFoundPage"),
);
const ListItems = lazy(() => import("../../components/ListItems/ListItems"));

function PrivateRoute({ children }) {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

	return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default function App() {
	const dispatch = useDispatch();
	const isRefreshing = useSelector(selectIsRefreshing);

	useEffect(() => {
		dispatch(refreshUser());
	}, [dispatch]);
	return isRefreshing ? (
		<div className={style.loader_box}>
			<ClipLoader
				color="#ae0000"
				size={50}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
	) : (
		<>
			<Suspense
				fallback={
					<div className={style.loader_box}>
						<ClipLoader
							color="#ae0000"
							size={100}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				}
			>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />

						<Route path="recipe/:id" element={<RecipePage />} />
						<Route
							path="recipe/add"
							element={
								<PrivateRoute>
									<AddRecipePage />
								</PrivateRoute>
							}
						/>

						<Route
							path="user/:id"
							element={
								<PrivateRoute>
									<UserPage />
								</PrivateRoute>
							}
						>
							<Route index element={<Navigate to="my-recipes" replace />} />
							<Route path="my-recipes" element={<ListItems />} />
							<Route path="my-favorites" element={<ListItems />} />
							<Route path="followers" element={<ListItems />} />
							<Route path="following" element={<ListItems />} />
						</Route>
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Routes>
			</Suspense>
		</>
	);
}
