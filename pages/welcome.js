import { useSession } from "next-auth/react";
import styles from "./welcome.module.css";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/router";
import { useEmail } from "./EmailContext";
import { signOut } from "next-auth/react";

export default function Welcome() {
    const { data, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") {
        router.push({ pathname: "/" });
    }

    const { emailNum, setEmailNum } = useEmail();

    const handleChange = (event) => {
        setEmailNum(event.target.value);
    };

    const onSubmit = () => {
        if (emailNum !== "") {
            console.log(emailNum);
            router.push({ pathname: "/emails" });
        }
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
            <main className={styles.main}>
                <h3>
                    Welcome
                    {/* may need to get profile info from this endpoint https://developers.google.com/gmail/api/reference/rest/v1/users/getProfile */}
                    {data && data.user && data.user.name
                        ? ", ".concat(data.user.name)
                        : ""}
                </h3>
                <p>Choose how many emails you want to browse...</p>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Emails
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={emailNum}
                            label="Emails"
                            onChange={handleChange}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={40}>40</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <div>
                    <Button
                        variant="contained"
                        sx={{ m: 1.5 }}
                        endIcon={<SendIcon />}
                        onClick={onSubmit}
                        // try to load the emails. if success, go to new page. if fail, go to error page
                    >
                        Load Emails
                    </Button>
                </div>
            </main>
        </div>
    );
}
