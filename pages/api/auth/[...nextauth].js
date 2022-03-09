import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

//import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your participant ID",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your 8-digit token",
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log(`credentials: ${JSON.stringify(credentials)}`);
        const user = { id: 1, name: "J Smith", email: "jsmith@example.com", username: "test1", password: "test1" };

        if (user.username == credentials.username && user.password == credentials.password) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
});
