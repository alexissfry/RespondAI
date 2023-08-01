import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorizationUrl:
                "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
            scope: "https://mail.google.com",
        }),
    ],
    jwt: {
        encryption: true,
    },
    secret: process.env.SECRET,
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            // console.log({ profile });
            if (account?.accessToken) {
                token.accessToken = account.accessToken;
            }
            return token;
        },
    },
});
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//     secret: process.env.JWT_SECRET,
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_SECRET,
//             scope: "https://mail.google.com",
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//         jwt: true,
//     },
//     jwt: {
//         secret: process.env.JWT_SECRET, // Use the JWT_SECRET variable from .env
//     },
// };
// export default NextAuth(authOptions);
