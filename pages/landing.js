import { useState } from "react";
import styles from "./landing.module.css";
import Button from "@mui/material/Button";
import { signIn } from "next-auth/react";

export default function Landing() {
    const [animalInput, setAnimalInput] = useState("");
    const [result, setResult] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        try {
            //   const response = await fetch("/api/generate", {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ animal: animalInput }),
            //   });

            //   const data = await response.json();
            if (response.status !== 200) {
                throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                );
            }

            setResult(data.result);
            setAnimalInput("");
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <img src="/envelope.png" className={styles.icon} />
                <h3>RespondAI</h3>
                <p>
                    Browse your unread emails and generate responses in an
                    instant.
                </p>
                <div>
                    <Button
                        variant="contained"
                        onClick={() =>
                            signIn("google", { callbackUrl: "/welcome" })
                        }
                    >
                        Sign into Gmail
                    </Button>
                </div>
            </main>
        </div>
    );
}
