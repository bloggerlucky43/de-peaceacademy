import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./page.module.css"; // Make sure this exists

export default function Home() {
  return <div className={styles.backgroundOnly}></div>;
}
