import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from '@mui/material/Button';

import FitbitHelper from "../lib/FitbitHelper.mjs";
import { inspect } from 'util';

const { DateTime } = require("luxon");


function avoidCircular(obj) {
    return inspect(obj);
  }



export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    console.log(
        `refresh-token.getServerSideProps: ctx: ${avoidCircular(ctx)}`
    );
    console.log(
        `refresh-token.getServerSideProps: session: ${JSON.stringify(session)}`
    );

    async function updateToken(hashCode, accessToken, refreshToken) {
        console.log(`updateToken, hashCode: ${hashCode}`);
        console.log(`updateToken, accessToken: ${accessToken}`);
        console.log(`updateToken, refreshToken: ${refreshToken}`);
        const firstUser = await prisma.users.findFirst({
            where: { hash: hashCode },
        });
    
        console.log(`firstUser: ${JSON.stringify(firstUser)}`);
    
        const updateUser = await prisma.users.update({
            where: { username: firstUser.username },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    
        console.log(`updateUser: ${JSON.stringify(updateUser)}`);
    }
    
    
    
    async function refreshToken() {
        console.log(`updateToken, hashCode: ${hashCode}`);
        console.log(`updateToken, accessToken: ${accessToken}`);
        console.log(`updateToken, refreshToken: ${refreshToken}`);
        const firstUser = await prisma.users.findFirst({
            where: { hash: hashCode },
        });
    
        console.log(`firstUser: ${JSON.stringify(firstUser)}`);
    
        const updateUser = await prisma.users.update({
            where: { username: firstUser.username },
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    
        console.log(`updateUser: ${JSON.stringify(updateUser)}`);
    }

    let userName = session.user.name;

    const user = await prisma.users.findFirst({
        where: { username: userName },
    });

    const refreshResult = await FitbitHelper.refreshToken(user.refreshToken)
        .then((responseData) => {
            console.log(
                `FitbitHelper.refreshToken: ${JSON.stringify(
                    responseData
                )}`
            );


            let newAccessToken = responseData.access_token;

            // If you followed the Authorization Code Flow, you were issued a refresh token. You can use your refresh token to get a new access token in case the one that you currently have has expired. Enter or paste your refresh token below. Also make sure you enteryour data in section 1 and 3 since it's used to refresh your access token.
            let newRefreshToken = responseData.refresh_token;

            // To Do: ideally, store both
            updateToken(user.hash, newAccessToken, newRefreshToken);

            return { value: "success", data: responseData };

            //res.status(200).json({ message: "authentication success" });
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(`Data: ${error.response.data}`);
                console.log(`Status: ${error.response.status}`);
                console.log(`StatusText: ${error.response.statusText}`);
                console.log(`Headers: ${error.response.headers}`);

                console.log(`Error response`);
                // which means, authentication falil
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);

                console.log(`Error request`);
            } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);

                console.log("Error else");
            }
            //res.status(error.response.status).json({ response: inspect(error.response.data) });

            return { value: "failed", data: inspect(error.response.data) };
        });


    return {
        props: { result: refreshResult },
    };
}

export default function RefreshToken({ result }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status == "loading") return <div>loading...</div>;
    if (!session) {
        router.push('/');
        return null;
    }

    console.log(`session: ${JSON.stringify(session)}`);



    return (
        <div className={styles.container}>
            <Head>
                <title>Walk To Joy</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>{`Refresh token ${result.value}`}</h1>
                <div>
                    {
                        JSON.stringify(result.data)
                    }
                </div>
                <div>
                    {
                        result.value == "failed" ? `Error: ${result.data.errorType}` : null
                    }
                </div>
                <Button variant="contained" style={{ width: "100%" }} onClick={(event) => {
            router.push("/main");
            return;
          }} >Return to settings</Button>
            </main>

            <footer className={styles.main}>
                <div>WalkToJoy Study</div>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div>School of Information</div>
                    <div>University of Michigan</div>
                </a>
            </footer>
        </div>
    );
}
