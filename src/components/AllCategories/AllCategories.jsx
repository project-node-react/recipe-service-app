import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters } from "../../redux/recipes/slice";
import style from "./AllCategories.module.css";

export default function AllCategories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      setFilters({
        category: null,
        ingredient: null,
        area: null,
      }),
    );

    navigate("/recipes");
  };

  return (
    <li className={style.card}>
      <button
        type="button"
        className={style.button}
        onClick={handleClick}
        aria-label="Open all recipes"
      >
        <span className={style.text}>All categories</span>
      </button>
    </li>
  );
}
