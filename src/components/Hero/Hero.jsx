import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import { openModal } from "../../redux/ui/slice";
import heroLarge from "../../assets/hero/hero-1.webp";
import heroSmall from "../../assets/hero/hero-2.webp";
import style from "./Hero.module.css";

export const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleAddRecipeClick = () => {
    if (isLoggedIn) {
      navigate("/recipe/add");
    } else {
      dispatch(openModal("signIn"));
    }
  };

  return (
    <section className={style.hero}>
      <div className={style.box}>
        <h1 className={style.title}>Improve your culinary talents</h1>
        <p className={style.subtitle}>
          Amazing recipes for beginners in the world of cooking, enveloping
          you in the aromas and tastes of various cuisines.
        </p>
        <button type="button" className={style.button} onClick={handleAddRecipeClick}>
          Add recipe
        </button>
      </div>
      <div className={style.gallery} aria-hidden="true">
        <img src={heroSmall} alt="" className={`${style.photo} ${style.photoSmall}`} />
        <img src={heroLarge} alt="" className={`${style.photo} ${style.photoLarge}`} />
      </div>
    </section>
  );
};
