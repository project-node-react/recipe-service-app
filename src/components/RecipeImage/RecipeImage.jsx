import styles from "./RecipeImage.module.css";

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}foodicon.svg`;

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

const RecipeImage = ({ image, title }) => {
  return (
    <img
      className={styles.image}
      src={image || FALLBACK_IMAGE}
      alt={image ? title : "Recipe image unavailable"}
      onError={handleImageError}
    />
  );
};

export default RecipeImage;
