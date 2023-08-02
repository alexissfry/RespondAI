import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "./noemails.module.css";

export default function NoEmails() {
    const { data, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push({ pathname: "/" });
    }
    return (
        <main class={styles.main}>
            <div class={styles.centeredContainer}>
                <h1>No emails to load</h1>
                <p>
                    There are no emails to display. Please select a new account
                    or try again later.
                </p>
                <Button variant="contained" onClick={() => router.push("/")}>
                    Return to Home
                </Button>
            </div>
        </main>
    );
}
