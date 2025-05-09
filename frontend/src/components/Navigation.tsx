import { Link } from "react-router-dom";
import styles from "./navigation.module.css";

export function Navigation() {
    console.log(styles);

    return (
        <nav className={styles["nav-bar"]}>
            <Link className={styles["nav-button"]} to="/">Home</Link>
            <Link className={styles["nav-button"]} to="/flash-cards">Flash Cards</Link>
        </nav>
    )
}