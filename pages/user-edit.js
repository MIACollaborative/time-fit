import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../component/Layout";

import TextField from "@mui/material/TextField";
/*
import logger from "../lib/logger";

*/

import { inspect } from "util";

import Link from "next/link";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import prisma from "../lib/prisma.mjs";
import { DateTime } from "luxon";

function replacer(key, value) {
    if (typeof value === "Date") {
        return value.toString();
    }
    return value;
}

const adminUsernameList = ["test1", "test2", "test3", "test4"];

export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    console.log(`user-edit.getServerSideProps: session: ${JSON.stringify(session)}`);


    if (!session) {
        return {
            props: { userInfo: {} },
        };
    }

    console.log(`user-edit.getServerSideProps: query: ${JSON.stringify(ctx.query)}`);


    let userName = ctx.query.user; // session.user.name;

    let uniqueUser = undefined;
    
    if (adminUsernameList.includes(session.user.name)) {
        uniqueUser =  await prisma.users.findFirst({
            where: { username: userName },
        });
    }
    

    console.log(`main.getServerSideProps: user: ${JSON.stringify(uniqueUser)}`);

    const userInfo = JSON.parse(JSON.stringify(uniqueUser, replacer));

    return {
        props: { userInfo },
    };
}

export default function PhoneEdit({ userInfo }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log(`InfoEdit.userInfo: ${JSON.stringify(userInfo)}`);

    const [preferredName, setPreferredName] = useState(
        userInfo != undefined && userInfo.preferredName != undefined ? userInfo.preferredName : ""
    );
    const [phone, setPhone] = useState(
        userInfo != undefined && userInfo.phone != undefined ? userInfo.phone : ""
    );

    // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
    if (status == "loading") return <div>loading...</div>;

    if (!session) {
        router.push("/");
        return null;
    }

    console.log(`session: ${JSON.stringify(session)}`);
    //console.log(`InfoEdit userInfo.joinAt: ${userInfo.joinAt}`);

    async function updateInfo(
        username,
        info
    ) {
        console.log(`InfoEdit.updateInfo: ${username}`);
        console.log(`InfoEdit.updateInfo.info: ${JSON.stringify(info)}`);

        const result = await fetch(
            "/api/user?function_name=update_info",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...info,
                    username: username
                }),
            }
        ).then((r) => {
            return r.json();
        });

        return result;
    }

    function onSaveClick(event) {
        let preparationInfo = undefined;
        console.log(`onSaveClick: userInfo.joinAt ${userInfo.joinAt}`);
        preparationInfo = {
            phone
        }

        console.log(`onSaveClick: updatedInfo preparation ${JSON.stringify(preparationInfo, null, 2)}`);

        updateInfo(
            userInfo.username,
            preparationInfo
        ).then((response) => {
            router.push("/dashboard");
            return response;
        });
    }

    return (
        <Layout title={"Preferred Name"} description={""}>
            <h1 className="project-text">Welcome to WalkToJoy Study!</h1>
            <h2 className="project-text">You are editing user info for: {userInfo.username}</h2>
            <div>
                <Fragment>{
                    true ? <TextField
                        fullWidth
                        label="Preferred Name"
                        id="fullWidth"
                        value={preferredName}
                        onChange={(event) => {
                            console.log(`setPreferredName: ${event.currentTarget.value}`);
                            setPreferredName(event.currentTarget.value);

                        }}
                    /> : null
                }</Fragment>

                <br />
                <Divider />
                <br />
                <Fragment>{
                    true ? <TextField
                        fullWidth
                        label="Phone Number"
                        id="fullWidth"
                        value={phone}

                        onChange={(event) => {
                            console.log(`setPhone: ${event.currentTarget.value}`);
                            setPhone(event.currentTarget.value);
                        }}
                    /> : null}</Fragment>

                <br />
                <br />
                <Button variant="contained"
                    className="project-button"
                    onClick={onSaveClick} >Save</Button>
            </div>

        </Layout>
    );
}
