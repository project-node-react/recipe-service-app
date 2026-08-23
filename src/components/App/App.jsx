import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import style from "./App.module.css";

const Layout = lazy(() => import("../../layouts/Layout/Layout"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const RecipesPage = lazy(() => import("../../pages/RecipesPage/RecipesPage"));
const RecipePage = lazy(() => import("../../pages/RecipePage/RecipePage"));
const AddRecipePage = lazy(
  () => import("../../pages/AddRecipePage/AddRecipePage"),
);
const NotFoundPage = lazy(
  () => import("../../pages/NotFoundPage/NotFoundPage"),
);

export default function App() {
  return (
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
          <Route index element={<HomePage />} />
          <Route path="recipes/:categoryId?" element={<RecipesPage />} />
            <Route path="recipe/:recipeId" element={<RecipePage />} />
          <Route path="add-recipe" element={<AddRecipePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
