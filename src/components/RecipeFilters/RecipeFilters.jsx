import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchIngredients } from "../../redux/ingredients/operations";
import { fetchAreas } from "../../redux/areas/operations";

import styles from "./RecipeFilters.module.css";

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
    <div className={styles.filters}>
      <div className={styles.field}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={ingredient}
            onChange={(event) => onIngredientChange(event.target.value)}
          >
            <option value="">Ingredients</option>

            {ingredients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <svg
            className={styles.icon}
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={area}
            onChange={(event) => onAreaChange(event.target.value)}
          >
            <option value="">Area</option>

            {areas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <svg
            className={styles.icon}
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 6.75L9 11.25L13.5 6.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
