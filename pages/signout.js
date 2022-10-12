import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from '../component/Layout';
import { Button } from "@mui/material";

export default function Signout() {
    const { data: session, status } = useSession();

    const router = useRouter();

    /*
    if (!session) {
        router.push("/");
        return null;
    }
    */


    return (
        <Layout title={"Walk To Joy"} description={""}>
            <Button 
                variant="contained" 
                className={"project-button-complete"}
                onClick={(event) => {
                    signOut({ callbackUrl: '/' });
                    return null;
                }}
              >
                Sign out
              </Button>
        </Layout>
    );
}