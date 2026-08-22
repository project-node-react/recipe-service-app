import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// import toast from "react-hot-toast";
import style from "./App.module.css";

const Layout = lazy(() => import("../../layouts/Layout/Layout"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const AddRecipePage = lazy(() => import("../../pages/AddRecipePage/AddRecipePage"));
const NotFoundPage = lazy(
  () => import("../../pages/NotFoundPage/NotFoundPage"),
);

export default function App() {
  //   const error = useSelector(selectError);
  //   useEffect(() => {
  //     if (error) {
  //       toast.error(`Error: ${error}`);
  //     }
  //   }, [error]);
  return (
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
            <Route path="*" element={<NotFoundPage />}></Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
