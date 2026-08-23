import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { api } from "../../redux/api";
import { fetchCategories } from "../../redux/categories/operations";
import { fetchAreas } from "../../redux/areas/operations";
import { fetchIngredients } from "../../redux/ingredients/operations";

export default function AddRecipePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const categories = useSelector((state) => state.categories.items);
  const areas = useSelector((state) => state.areas.items);
  const ingredients = useSelector((state) => state.ingredients.items);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [time, setTime] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [measure, setMeasure] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [thumb, setThumb] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
    if (!areas.length) dispatch(fetchAreas());
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch, categories.length, areas.length, ingredients.length]);

  const handleAddIngredient = () => {
    if (!ingredientId || !measure.trim()) return;

    const ingredient = ingredients.find(
      (item) => item.id === ingredientId,
    );

    if (!ingredient) return;

    if (selectedIngredients.some((item) => item.id === ingredientId)) {
      return;
    }

    setSelectedIngredients((prev) => [
      ...prev,
      {
        id: ingredient.id,
        name: ingredient.name,
        measure: measure.trim(),
      },
    ]);

    setIngredientId("");
    setMeasure("");
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("You need to log in first.");
      return;
    }

    if (!selectedIngredients.length) {
      setError("Add at least one ingredient.");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("instructions", instructions);
      formData.append("category", category);
      formData.append("area", area);
      formData.append("time", time);

      formData.append(
        "ingredients",
        JSON.stringify(
          selectedIngredients.map(({ id, measure }) => ({
            id,
            measure,
          })),
        ),
      );

      if (thumb) {
        formData.append("thumb", thumb);
      }

      await api.post("/recipes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/recipes");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to create recipe.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Add recipe</h1>

      {!token && <p>You need to log in before adding a recipe.</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label>
          Instructions
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            required
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Choose category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Area
          <select
            value={area}
            onChange={(event) => setArea(event.target.value)}
            required
          >
            <option value="">Choose area</option>
            {areas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cooking time
          <input
            type="number"
            min="1"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            required
          />
        </label>

        <label>
          Ingredient
          <select
            value={ingredientId}
            onChange={(event) => setIngredientId(event.target.value)}
          >
            <option value="">Choose ingredient</option>
            {ingredients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Measure
          <input
            value={measure}
            onChange={(event) => setMeasure(event.target.value)}
            placeholder="e.g. 200 g"
          />
        </label>

        <button type="button" onClick={handleAddIngredient}>
          Add ingredient
        </button>

        {selectedIngredients.length > 0 && (
          <ul>
            {selectedIngredients.map((item) => (
              <li key={item.id}>
                {item.name} — {item.measure}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <label>
          Recipe image
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setThumb(event.target.files?.[0] || null)
            }
          />
        </label>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add recipe"}
        </button>
      </form>
    </main>
  );
}