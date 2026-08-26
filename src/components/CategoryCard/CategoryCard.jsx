import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters } from "../../redux/recipes/slice";
import style from "./CategoryCard.module.css";

import beefImage from "../../assets/categories/Beef.png";
import breakfastImage from "../../assets/categories/Breakfast.png";
import dessertsImage from "../../assets/categories/Desserts.png";
import goatImage from "../../assets/categories/Goat.png";
import lambImage from "../../assets/categories/Lamb.png";
import miscellaneousImage from "../../assets/categories/Miscellaneous.png";
import pastaImage from "../../assets/categories/Pasta.png";
import porkImage from "../../assets/categories/Pork.png";
import seafoodImage from "../../assets/categories/Seafood.png";
import sideImage from "../../assets/categories/Side.png";
import starterImage from "../../assets/categories/Starter.png";

const categoryImages = {
  Beef: beefImage,
  Breakfast: breakfastImage,
  Dessert: dessertsImage,
  Goat: goatImage,
  Lamb: lambImage,
  Miscellaneous: miscellaneousImage,
  Pasta: pastaImage,
  Pork: porkImage,
  Seafood: seafoodImage,
  Side: sideImage,
  Starter: starterImage,
};

export default function CategoryCard({ category }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setFilters({ category: category.id }));
    navigate(`/recipes/${category.id}`);
  };

  return (
    <li className={style.card}>
      <img
        className={style.image}
        src={categoryImages[category.name]}
        alt={category.name}
      />

      <div className={style.overlay} />

      <div className={style.content}>
        <span className={style.name}>{category.name}</span>

        <button
          type="button"
          className={style.button}
          onClick={handleClick}
          aria-label={`Open ${category.name} recipes`}
        >
          <svg className={style.icon} aria-hidden="true">
            <use href="/icons.svg#arrow-up-right" />
          </svg>
        </button>
      </div>
    </li>
  );
}
