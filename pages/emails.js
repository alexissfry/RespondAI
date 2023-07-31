import React from "react";
import { useEmail } from "./EmailContext";
import { useSession } from "next-auth/react";

export default function Emails() {
    const { emailNum } = useEmail();
    console.log("type of emailnum", typeof emailNum);
    const { data: session, status } = useSession();
    const { accessToken } = session;
    console.log("session", session);
    return (
        <div>
            <h1>{emailNum}</h1>
        </div>
    );
}
