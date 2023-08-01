import React from "react";
import { useEmail } from "./EmailContext";
import { useSession } from "next-auth/react";

export default function Emails() {
  const { emailNum } = useEmail();
  const { data: session, status } = useSession();
  const { accessToken } = session;

  async function getMessages() {
    const axios = require("axios");
    console.log(session);
    console.log(accessToken);

    try {
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(
          session?.user?.email
        )}/messages`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            maxResults: emailNum,
            q: "is:unread",
          },
        }
      );
      console.log(response.data.messages);
    } catch (error) {
      console.error(error.message);
    }
  }
  getMessages();
  return (
    <div>
      <h1>{emailNum}</h1>
    </div>
  );
}
