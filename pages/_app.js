import { SessionProvider } from "next-auth/react";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterLuxon';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ToastContainer />
      </SessionProvider>
    </LocalizationProvider>

  )
}

export default MyApp
