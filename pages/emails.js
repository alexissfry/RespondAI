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
import { IconButton } from "@mui/material";

const axios = require("axios");

export default function Emails() {
    const router = useRouter();
    const [loadedEmails, setLoadedEmails] = useState([]);
    const [emailIndex, setEmailIndex] = useState(0);
    const [currEmail, setCurrEmail] = useState();

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
        console.log("get email for ", emailId);
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
        setCurrEmail(response.data);
        return response;
    };

    // rendering
    useEffect(() => {
        loadEmails()
            .then((response) => {
                console.log(response.data);
                setLoadedEmails(response.data.messages);
                console.log(response.data.messages.length);
                // for testing, call getemail here
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        console.log(loadedEmails);
        for (let i = 0; i < loadedEmails.length; i++) {
            getEmail(loadedEmails[i].id)
                .then((resp) => {
                    console.log(resp.data);
                    console.log("body: ", resp.data.payload.body);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [loadedEmails]);

    useEffect(() => {
        if (loadedEmails.length === 0) {
            return;
        }
        currEmail === undefined;
        getEmail(loadedEmails[emailIndex].id);
    }, [emailIndex]);

    const { emailNum } = useEmail();

    const renderEmail = () => {
        if (loadedEmails.length === 0 || currEmail === undefined) {
            return <p>Loading</p>;
        }
        let subject = "";
        let from = "";
        let body = currEmail?.payload?.parts[0]?.body?.data;
        if (body !== undefined) {
            try {
                // THIS IS NOT WORKING :(
                console.log("body: ", body);
                body = atob(body);
                console.log("after atob: ", body);
            } catch (err) {
                console.error(err);
                console.log(body);
            }
        }

        for (let i = 0; i < currEmail.payload.headers.length; i++) {
            if (currEmail.payload.headers[i].name === "Subject") {
                subject = currEmail.payload.headers[i].value;
            } else if (currEmail.payload.headers[i].name === "From") {
                from = currEmail.payload.headers[i].value;
            }
        }

        return (
            <div>
                <pre>{JSON.stringify(currEmail, undefined, 2)}</pre>
                <h3>Subject: {subject}</h3>
                <h3>From: {from}</h3>
                <p>{body}</p>
            </div>
        );
    };

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
                    <IconButton
                        onClick={() =>
                            setEmailIndex(
                                (emailIndex + loadedEmails.length - 1) %
                                    loadedEmails.length
                            )
                        }
                    >
                        <KeyboardArrowLeftIcon fontSize="large" />
                    </IconButton>
                    <div class={styles.mission_container}>{renderEmail()}</div>
                    <IconButton
                        onClick={() =>
                            setEmailIndex(
                                (emailIndex + 1) % loadedEmails.length
                            )
                        }
                    >
                        <KeyboardArrowRightIcon fontSize="large" />
                    </IconButton>
                </div>
            </main>
        </div>
    );
}
