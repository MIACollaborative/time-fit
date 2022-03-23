import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterLuxon';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </LocalizationProvider>

  )
}

export default MyApp
