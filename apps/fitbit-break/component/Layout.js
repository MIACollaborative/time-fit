import React from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";

export default function Layout(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{props.children}</main>

      <footer className={styles.footer}>
        <br />
        <div>
          <b>Fitbit Break Study</b>
        </div>
        <br />
        <div>School of Information</div>
        <div>University of Michigan</div>
      </footer>
    </div>
  );
}
