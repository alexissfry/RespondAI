import React, { useEffect, useState } from "react";
import { useEmail } from "./EmailContext";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "./emails.module.css";
const axios = require("axios");

export default function Emails() {
    const router = useRouter();
    const [loadedEmails, setLoadedEmails] = useState([]);

    const { data: session, status } = useSession();

    if (status === "unauthenticated") {
        router.push({ pathname: "/" });
    }

    const loadEmails = async () => {
        const requestConfig = {
            url: `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(
                session?.user?.id
            )}/messages`,
            method: "get",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
            params: {
                maxResults: emailNum,
                q: "is:unread",
            },
        };

        console.log("Request config:", requestConfig);

        const response = await axios(requestConfig);

        return response;
    };

    const getEmail = async (emailId) => {
        const requestConfig = {
            url: `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(
                session?.user?.id
            )}/messages/${emailId}`,
            method: "get",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        };

        console.log("Request config:", JSON.stringify(requestConfig, null, 2));

        const response = await axios(requestConfig);

        return response;
    };

    useEffect(() => {
        loadEmails()
            .then((response) => {
                console.log(response.data);
                setLoadedEmails(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const { emailNum } = useEmail();

    return (
        <div>
            <Box
                m={1}
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Button
                    variant="contained"
                    onClick={() =>
                        signOut("google").then(() => router.push("/"))
                    }
                >
                    Sign Out
                </Button>
            </Box>

            <main>
                <div class={styles.center_box}>
                    <KeyboardArrowLeftIcon fontSize="large" />
                    <div class={styles.mission_container}>
                        <p>{emailNum}</p>
                    </div>
                    <KeyboardArrowRightIcon fontSize="large" />
                </div>
            </main>
        </div>
    );
}
