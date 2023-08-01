import Head from "next/head";
import { useState } from "react";
import Landing from "./landing";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from "@mui/material/Button";

export default function Home() {
    const { data, status } = useSession();

    const renderLoginLogout = () => {
        if (status === "authenticated") {
            return (
                <div>
                    <h1> hi {data.user.name}</h1>
                    <img
                        src={data.user.image}
                        alt={data.user.name + " photo"}
                    />
                    <button onClick={signOut}>sign out</button>
                </div>
            );
        } else if (status === "loading") {
            return <h1> loading... please wait</h1>;
        } else {
            return (
                <div>
                    <button onClick={() => signIn()}>
                        sign in with google
                    </button>
                </div>
            );
        }
    };

    const [animalInput, setAnimalInput] = useState("");
    const [result, setResult] = useState("");

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ animal: animalInput }),
            });

            const data = await response.json();
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

    //   const render_page = () => {
    //     if (status !== 'authenticated') {
    //         return <Landing />
    //     } else {
    //         return <div>
    //             <Button variant="contained" onClick={() => signOut('google')}>sign out with google</Button>
    //         </div>
    //     }
    //   }

    return (
        <div>
            <Head>
                <title>RespondAI</title>
                <link rel="shortcut icon" href="/logo.ico" />
            </Head>
            <main>
                <Landing />
            </main>
        </div>
    );
}
