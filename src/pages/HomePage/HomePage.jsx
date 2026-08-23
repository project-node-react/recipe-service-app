import Container from "../../components/Container/Container";
import MainTitle from "../../components/MainTitle/MainTitle";
import Subtitle from "../../components/Subtitle/Subtitle";
import CategoryList from "../../components/CategoryList/CategoryList";

export default function HomePage() {
  return (
    <Container>
      <MainTitle>Delicious recipes</MainTitle>
      <Subtitle>Choose a category</Subtitle>
      <CategoryList />
    </Container>
  );
}