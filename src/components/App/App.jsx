import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
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
const NotFoundPage = lazy(
  () => import("../../pages/NotFoundPage/NotFoundPage"),
);

export default function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);
  return isRefreshing ? (
    <ClipLoader
      color="#1976d2"
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    <>
      <Suspense
        fallback={
          <div className={style.loader_box}>
            <ClipLoader
              color="#e44848"
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />}></Route>
            <Route path="recipe/add" element={<AddRecipePage />} />
            <Route path="recipe/:id" element={<RecipePage />} />
            <Route path="*" element={<NotFoundPage />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
