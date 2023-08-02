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

export default function Respond() {
    const router = useRouter();

    const { data: session, status } = useSession();
    const [currEmail, setCurrEmail] = useState();

    if (status === "unauthenticated") {
        router.push({ pathname: "/" });
    }

    let emailId = router.query.emailId;
    if (emailId === undefined) {
        router.push({ pathname: "/welcome" });
    }

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

    useEffect(() => {
        getEmail(emailId)
            .then((resp) => {
                setCurrEmail(resp.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const emailBody = (currEmail) => {
        if (!currEmail?.payload?.parts) return "";

        // Find the part that contains the email body (text or HTML)
        const bodyPart = currEmail.payload.parts.find(
            (part) => part.mimeType === "text/plain"
        );
        // If there is no plain text part, try to find the HTML part
        const htmlPart = currEmail.payload.parts.find(
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
        if (currEmail === undefined) {
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
                <div class={styles.mission_container}>
                    <div class={styles.contents}>
                        <h2>Respond to "{subject}"</h2>
                    </div>

                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            variant="contained"
                            onClick={
                                // make the email using openai, get the link and send the user there
                                () => {
                                    window.open(
                                        "https://www.google.com",
                                        "_blank"
                                    );
                                }
                            }
                        >
                            Create Email
                        </Button>
                    </Box>
                </div>
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
