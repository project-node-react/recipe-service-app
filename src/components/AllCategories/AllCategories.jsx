import { useNavigate } from "react-router-dom";

export default function AllCategories() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipes");
  };

  return (
    <li>
      <h3>All Categories</h3>

      <button
        type="button"
        onClick={handleClick}
        aria-label="Open all recipes"
      >
        →
      </button>
    </li>
  );
}