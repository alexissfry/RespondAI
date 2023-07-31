import { useSession } from 'next-auth/react';
import styles from "./welcome.module.css";
import * as React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";


export default function Welcome() {
    const { data, status } = useSession();
    const [emailNum, setEmailNum] = React.useState("");

    const handleChange = (event) => {
        setEmailNum(event.target.value);
    };

    return (
      <div>
        <main className={styles.main}>
          <h3>Welcome{data && data.user ? ", ".concat(data.user.name) : ""}</h3>
          <p>Choose how many emails you want to browse...</p>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Emails</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={emailNum}
                label="Emails"
                onChange={handleChange}
              >
                <MenuItem value={10}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={10}>15</MenuItem>
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
              //onClick={() => signIn("google", { callbackUrl: "/welcome" })}
            >
              Load Emails
            </Button>
          </div>
        </main>
      </div>
    );
}
