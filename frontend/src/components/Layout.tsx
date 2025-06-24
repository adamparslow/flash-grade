import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import styles from "./layout.module.css";

export function Layout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Navigation />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer} />
    </div>
  );
}
