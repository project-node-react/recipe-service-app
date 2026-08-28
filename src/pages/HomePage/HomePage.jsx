import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Container from "../../components/Container/Container";
import CategoryList from "../../components/CategoryList/CategoryList";
import SignInModal from "../../components/SignInModal/SignInModal";

import { fetchRecipes } from "../../redux/recipes/operations";
import {
	selectRecipesPage,
	selectRecipesFilters,
} from "../../redux/recipes/selectors";

import style from "./HomePage.module.css";
import SignUpModal from "../../components/SignUpModal/SignUpModal";

import { Hero } from "../../components/Hero/Hero";
import Testimonials from "../../components/Testimonials/Testimonials";
import RecipesComponent from "../../components/RecipesComponent/RecipesComponent";

export default function HomePage() {
	const dispatch = useDispatch();

	const page = useSelector(selectRecipesPage);
	const filters = useSelector(selectRecipesFilters);

	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isSignUpOpen, setIsSignUpOpen] = useState(false);

	// Кожна зміна сторінки або фільтрів — це новий запит на бекенд:
	// пагінація серверна, а не нарізка вже завантаженого масиву.
	useEffect(() => {
		dispatch(fetchRecipes());
	}, [dispatch, page, filters]);

	const handleAuthRequired = useCallback(() => setIsSignInOpen(true), []);
	const isCategorySelected = Boolean(filters?.category);
	return (
		<Container>
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
		</Container>
	);
}
