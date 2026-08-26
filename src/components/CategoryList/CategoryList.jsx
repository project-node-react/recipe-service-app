import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categories/operations";
import CategoryCard from "../CategoryCard/CategoryCard";
import AllCategories from "../AllCategories/AllCategories";

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
    return <p>Loading categories...</p>;
  }

  return (
    <section>
      <ul>
        <AllCategories />
        
        {items.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ul>
    </section>
  );
}