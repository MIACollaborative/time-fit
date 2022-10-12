import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from '../component/Layout';
import { Button } from "@mui/material";

export default function Signout() {
    const router = useRouter();
    return (
        <Layout title={"Walk To Joy"} description={""}>
            <Button 
                variant="contained" 
                className={"project-button-complete"}
                onClick={(event) => {
                    signOut();
                    //router.push("/");
                }}
              >
                Sign out
              </Button>
        </Layout>
    );
}