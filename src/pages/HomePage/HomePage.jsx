import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CategoryList from "../../components/CategoryList/CategoryList";
import SignInModal from "../../components/SignInModal/SignInModal";

import { selectRecipesFilters } from "../../redux/recipes/selectors";

import SignUpModal from "../../components/SignUpModal/SignUpModal";

import { Hero } from "../../components/Hero/Hero";
import Testimonials from "../../components/Testimonials/Testimonials";
import RecipesComponent from "../../components/RecipesComponent/RecipesComponent";
import { resetRecipesFilters } from "../../redux/recipes/slice";

export default function HomePage() {
	const dispatch = useDispatch();

	const filters = useSelector(selectRecipesFilters);

	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);

	useEffect(() => {
		dispatch(resetRecipesFilters());
	}, [dispatch]);

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
