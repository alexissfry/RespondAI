import React from "react";
import { useEmail } from "./EmailContext";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "./emails.module.css";

export default function Emails() {
    const router = useRouter();

    const { data, status } = useSession();

    if (status === "unauthenticated") {
        router.push({ pathname: "/" });
    }

    const { emailNum } = useEmail();

    const { data: session } = useSession();
    console.log("session", session);

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
                        <p>hi</p>
                    </div>
                    <KeyboardArrowRightIcon fontSize="large" />
                </div>
            </main>
        </div>
    );
}
