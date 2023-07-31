import { SessionProvider } from "next-auth/react";
import { EmailProvider } from "./EmailContext";

function App({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <EmailProvider>
                <Component {...pageProps} />
            </EmailProvider>
        </SessionProvider>
    );
}

export default App;
