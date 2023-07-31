import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data, status } = useSession();

  const renderLoginLogout = () => {
    if (status === 'authenticated') {
        return <div>
        <h1> hi {data.user.name}</h1>
        <img src={data.user.image} alt={data.user.name + ' photo'} />
        <button onClick={signOut}>sign out</button>
      </div>
    } else if (status === 'loading') {
        return <h1> loading... please wait</h1>
    } else {
        return <div>
            <button onClick={() => signIn('google')}>sign in with google</button>
        </div>
    }
}


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
        throw data.error || new Error(`Request failed with status ${response.status}`);
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
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>

        {renderLoginLogout()}
      </main>
    </div>
  );
}
