import styles from './MainTitle.module.css';

export const MainTitle = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>;
};