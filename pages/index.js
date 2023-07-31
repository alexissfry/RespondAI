import Head from "next/head";
import { useState } from "react";
import Landing from "./landing";

export default function Home() {
  return (
    <div>
      <Head>
        <title>RespondAI</title>
        <link rel="icon" href="/envelope.png" />
      </Head>
      <main>
        <Landing />
      </main>
    </div>
  );
}
