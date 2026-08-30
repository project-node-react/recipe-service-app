import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import CategoryList from "../../components/CategoryList/CategoryList";
import SignInModal from "../../components/SignInModal/SignInModal";

import { selectRecipesFilters } from "../../redux/recipes/selectors";

import SignUpModal from "../../components/SignUpModal/SignUpModal";

import { Hero } from "../../components/Hero/Hero";
import Testimonials from "../../components/Testimonials/Testimonials";
import RecipesComponent from "../../components/RecipesComponent/RecipesComponent";

export default function HomePage() {
  const filters = useSelector(selectRecipesFilters);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleAuthRequired = useCallback(() => setIsSignInOpen(true), []);
  const isCategorySelected = Boolean(filters?.category);
  return (
    <>
      <Hero onAuthRequired={handleAuthRequired} />
      {isCategorySelected ? <RecipesComponent /> : <CategoryList />}

      <Testimonials />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onCreateAccount={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignInAccount={() => {
          setIsSignInOpen(true);
          setIsSignUpOpen(false);
        }}
      />
    </>
  );
}
