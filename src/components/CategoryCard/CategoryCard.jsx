import { useNavigate } from "react-router-dom";

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipes/${category.id}`);
  };

  return (
    <li>
      <h3>{category.name}</h3>

      <button
        type="button"
        onClick={handleClick}
        aria-label={`Open ${category.name} recipes`}
      >
        →
      </button>
    </li>
  );
}