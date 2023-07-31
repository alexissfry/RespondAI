import { useSession } from "next-auth/react";
import styles from "./welcome.module.css";

export default function Welcome() {
    const { data, status } = useSession();

    return (
        <div>
            <main className={styles.main}>
                <h3>
                    Welcome
                    {data && data.user ? ", ".concat(data.user.name) : ""}
                </h3>
                <p>Choose how many emails you want to browse...</p>
            </main>
        </div>
    );
}
