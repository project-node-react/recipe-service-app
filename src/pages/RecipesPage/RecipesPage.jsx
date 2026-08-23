import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../components/Container/Container";
import MainTitle from "../../components/MainTitle/MainTitle";
import Subtitle from "../../components/Subtitle/Subtitle";
import RecipeFilters from "../../components/RecipeFilters/RecipeFilters";
import RecipeList from "../../components/RecipeList/RecipeList";
import RecipePagination from "../../components/RecipePagination/RecipePagination";
import { fetchRecipes } from "../../redux/recipes/operations";

export default function RecipesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const [ingredient, setIngredient] = useState("");
  const [area, setArea] = useState("");
  const [page, setPage] = useState(1);

  const categories = useSelector((state) => state.categories.items);
  const { items, isLoading, error, totalPages } = useSelector(
    (state) => state.recipes,
  );

  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  useEffect(() => {
    dispatch(
      fetchRecipes({
        ...(categoryId ? { category: categoryId } : {}),
        ...(ingredient ? { ingredient } : {}),
        ...(area ? { area } : {}),
        page,
        limit: 12,
      }),
    );
  }, [dispatch, categoryId, ingredient, area, page]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const handleBack = () => {
    navigate("/");
  };

  const handleIngredientChange = (value) => {
    setIngredient(value);
    setPage(1);
  };

  const handleAreaChange = (value) => {
    setArea(value);
    setPage(1);
  };

  return (
    <Container>
      <button type="button" onClick={handleBack}>
        Back
      </button>

      <MainTitle>
        {selectedCategory?.name || "All categories"}
      </MainTitle>

      <Subtitle>Choose a recipe</Subtitle>

      <RecipeFilters
        ingredient={ingredient}
        area={area}
        onIngredientChange={handleIngredientChange}
        onAreaChange={handleAreaChange}
      />

      {isLoading && <p>Loading recipes...</p>}

      {!isLoading && !error && <RecipeList recipes={items} />}

      <RecipePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </Container>
  );
}