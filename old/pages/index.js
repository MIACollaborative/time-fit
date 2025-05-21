import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../component/Layout'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';


export default function Home({}) {

  const { data: session, status } = useSession();
  const router = useRouter();
  

  // status: enum mapping to three possible session states: "loading" | "authenticated" | "unauthenticated"
  if (status == "loading") return <div>loading...</div>;
  
  if (session){
      router.push('/main');
      return null;
  }
  

  console.log(`session: ${JSON.stringify(session)}`);

  return (
    <Layout title={"Walk To Joy"} description={""}>
    <Fragment>
        <h1 className="project-text">
        Walk To Joy
        </h1>
        <br />

        <Button 
        variant="contained" 
        className="project-button"
        onClick={(event) => {
            signIn();
          }} >Continue</Button>


      </Fragment>
    </Layout>

  )
}
