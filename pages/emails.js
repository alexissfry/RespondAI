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
import { CircularProgress } from "@mui/material";
import { decode } from "base64-arraybuffer";

const axios = require("axios");

export default function Emails() {
    const router = useRouter();
    const [loadedEmails, setLoadedEmails] = useState([]);
    const [emailIndex, setEmailIndex] = useState(-1);
    const [currEmail, setCurrEmail] = useState();
    const [currEmailLink, setCurrEmailLink] = useState("");
    const [lastChange, setLastChange] = useState(1);

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

        const response = await axios(requestConfig);

        return response;
    };

    const getEmail = async (emailId) => {
        // console.log("get email for ", emailId);
        const requestConfig = {
            url: `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(
                session?.user?.id
            )}/messages/${emailId}`,
            method: "get",
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        };

        const response = await axios(requestConfig);
        return response;
    };

    // rendering
    useEffect(() => {
        loadEmails()
            .then((response) => {
                // console.log(response.data);

                setLoadedEmails(response.data.messages);
                // console.log(response.data.messages.length);
                if (response.data.messages.length === 0) {
                    router.push({ pathname: "/noemails" });
                }
                setEmailIndex(0);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // useEffect(() => {
    //     console.log(loadedEmails);
    //     for (let i = 0; i < loadedEmails.length; i++) {
    //         getEmail(loadedEmails[i].id)
    //             .then((resp) => {
    //                 if (i == emailIndex) {
    //                     setCurrEmail(resp.data);
    //                 }
    //                 // console.log(resp.data);
    //                 // console.log("body: ", resp.data.payload.body);
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             });
    //     }
    // }, [loadedEmails]);

    useEffect(() => {
        if (loadedEmails.length === 0) {
            return;
        }
        currEmail === undefined;
        getEmail(loadedEmails[emailIndex].id)
            .then((resp) => {
                setCurrEmail(resp.data);
                setCurrEmailLink(
                    `https://mail.google.com/mail/u/0/#inbox/${resp.data.id}`
                );
                console.log(currEmailLink);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [emailIndex]);

    const { emailNum } = useEmail();

    const emailBody = (email) => {
        if (!email?.payload?.parts) return "";

        // Find the part that contains the email body (text or HTML)
        const bodyPart = email.payload.parts.find(
            (part) => part.mimeType === "text/plain"
        );
        // If there is no plain text part, try to find the HTML part
        const htmlPart = email.payload.parts.find(
            (part) => part.mimeType === "text/html"
        );

        if (bodyPart) {
            const arrayBuffer = decode(bodyPart.body.data);
            const textDecoder = new TextDecoder();
            return textDecoder.decode(arrayBuffer);
        } else if (htmlPart) {
            const arrayBuffer = decode(htmlPart.body.data);
            const textDecoder = new TextDecoder();
            return textDecoder.decode(arrayBuffer);
        } else {
            return "No email body available.";
        }
    };

    const renderEmail = () => {
        if (loadedEmails.length === 0 || currEmail === undefined) {
            const indicatorSize = 80;
            return (
                <div class={styles.loading_box}>
                    <CircularProgress
                        size={indicatorSize}
                        sx={{
                            // position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: `${-indicatorSize / 2}px`,
                            marginLeft: `${-indicatorSize / 2}px`,
                        }}
                    />
                </div>
            );
        }
        let subject = "";
        let from = "";
        let body = emailBody(currEmail);

        for (let i = 0; i < currEmail.payload.headers.length; i++) {
            if (currEmail.payload.headers[i].name === "Subject") {
                subject = currEmail.payload.headers[i].value;
            } else if (currEmail.payload.headers[i].name === "From") {
                from = currEmail.payload.headers[i].value;
            }
        }

        return (
            <div class={styles.center_box}>
                <IconButton
                    onClick={() => {
                        setEmailIndex(
                            (emailIndex + loadedEmails.length - 1) %
                                loadedEmails.length
                        );
                        setLastChange(-1);
                    }}
                >
                    <KeyboardArrowLeftIcon fontSize="large" />
                </IconButton>
                <div class={styles.mission_container}>
                    <div class={styles.contents}>
                        <h2>{subject}</h2>
                        <h3>{from}</h3>
                        <p>{body.substring(0, Math.min(200, body.length))}</p>
                    </div>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            onClick={() => window.open(currEmailLink, "_blank")}
                        >
                            View Email in Gmail
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() =>
                                router.push({
                                    pathname: "/respond",
                                    query: { emailId: currEmail.id },
                                })
                            }
                        >
                            Generate AI Response
                        </Button>
                    </Box>
                </div>
                <IconButton
                    onClick={() =>
                        setEmailIndex((emailIndex + 1) % loadedEmails.length)
                    }
                >
                    <KeyboardArrowRightIcon fontSize="large" />
                </IconButton>
            </div>
        );
    };

    return (
        <div>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Button
                    variant="contained"
                    onClick={() => router.push("/welcome")}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={() =>
                        signOut("google").then(() => router.push("/"))
                    }
                >
                    Sign Out
                </Button>
            </Box>

            <main class={styles.main}>
                <div>{renderEmail()}</div>
            </main>
        </div>
    );
}
