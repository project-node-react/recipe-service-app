import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIngredients } from "../../redux/ingredients/operations";
import { fetchAreas } from "../../redux/areas/operations";

export default function RecipeFilters({
  ingredient,
  area,
  onIngredientChange,
  onAreaChange,
}) {
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.items);
  const areas = useSelector((state) => state.areas.items);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    if (!areas.length) {
      dispatch(fetchAreas());
    }
  }, [dispatch, ingredients.length, areas.length]);

  return (
    <div>
      <select
        value={ingredient}
        onChange={(event) => onIngredientChange(event.target.value)}
      >
        <option value="">Choose ingredient</option>

        {ingredients.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={area}
        onChange={(event) => onAreaChange(event.target.value)}
      >
        <option value="">Choose area</option>

        {areas.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}