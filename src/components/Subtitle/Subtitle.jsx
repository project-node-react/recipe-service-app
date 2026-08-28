import styles from "./Subtitle.module.css";

export const Subtitle = ({ children }) => {
	return <h2 className={styles.subtitle}>{children}</h2>;
};
