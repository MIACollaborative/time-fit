import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import bcrypt from "bcrypt";
import UserInfoHelper from "@time-fit/helper/UserInfoHelper.js";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await UserInfoHelper.getUserInfoByUsername(username);

          if (user == null) {
            console.log(`No such user`);
            return null;
          } else {
            let compareResult = await bcrypt
              .compare(credentials.password, user.password)
              .then((result) => {
                return result;
              });

            if (!compareResult) {
              // If you return null then an error will be displayed advising the user to check their details.
              console.log(`Credentials issue`);
              return null;
            }
          }

          // return user object with their profile data
          return user;
        } catch (error) {
            return null;

        /*
          if (error instanceof ZodError) {
            console.log(`Zod error: ${error.message}`);
            return null;
          }
            */
        }
      },
    }),
  ],
});
