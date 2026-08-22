import { MainTitle } from "../../components/MainTitle/MainTitle"; 
import { PathInfo } from "../../components/PathInfo/PathInfo"; 
import { Subtitle } from "../../components/Subtitle/Subtitle";
import AddRecipeForm from "../../components/AddRecipeForm/AddRecipeForm";
import styles from "./AddRecipePage.module.css";

const AddRecipePage = () => {
  return (
    <div className={styles.pageContainer}>
      <PathInfo />
      
      <div className={styles.headerSection}>
        <MainTitle>ADD RECIPE</MainTitle>
        <Subtitle>Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.</Subtitle>
      </div>

      <div className={styles.formSection}>
         <AddRecipeForm />
      </div>
    </div>
  );
};

export default AddRecipePage;