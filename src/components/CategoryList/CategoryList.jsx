import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import CategoryCard from "../CategoryCard/CategoryCard";
import AllCategories from "../AllCategories/AllCategories";
import style from "./CategoryList.module.css";

const categoryOrder = [
  "Beef",
  "Breakfast",
  "Dessert",
  "Lamb",
  "Goat",
  "Miscellaneous",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
];

export default function CategoryList() {
  const dispatch = useDispatch();

  const { items, isLoading, error } = useSelector(
    (state) => state.categories,
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  if (isLoading) {
    return <p className={style.loading}>Loading categories...</p>;
  }

  const categories = categoryOrder
    .map((name) => items.find((category) => category.name === name))
    .filter(Boolean);

  const rows = [
    categories.slice(0, 3),
    categories.slice(3, 6),
    categories.slice(6, 9),
    categories.slice(9, 11),
  ];

  return (
    <section className={style.section}>
      <div className={style.intro}>
        <h2 className={style.title}>Categories</h2>

        <p className={style.description}>
          Discover a limitless world of culinary possibilities and enjoy
          exquisite recipes that combine taste, style and the warm atmosphere
          of the kitchen.
        </p>
      </div>

      <div className={style.list}>
        <ul className={`${style.row} ${style.rowOne}`}>
          {rows[0].map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ul>

        <ul className={`${style.row} ${style.rowTwo}`}>
          {rows[1].map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ul>

        <ul className={`${style.row} ${style.rowThree}`}>
          {rows[2].map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ul>

        <ul className={`${style.row} ${style.rowFour}`}>
          {rows[3].map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}

          <AllCategories />
        </ul>
      </div>
    </section>
  );
}
