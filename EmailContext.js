import React, { createContext, useState, useContext } from "react";

const EmailContext = createContext();

export function EmailProvider({ children }) {
    const [emailNum, setEmailNum] = useState("");

    return (
        <EmailContext.Provider value={{ emailNum, setEmailNum }}>
            {children}
        </EmailContext.Provider>
    );
}

export function useEmail() {
    return useContext(EmailContext);
}
