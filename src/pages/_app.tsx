// pages/_app.tsx
import * as React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import { Navbar } from '@/components/Navbar';
import Script from 'next/script'
import { useRouter } from 'next/router';
import { useEffect } from "react";
import * as gtag from "../lib/gtag"

const theme = extendTheme({
  colors: {
    customOrange: {
      500: "#FFA500",
    },
    brand: {
      "cool-gray": "#7D859B",
      "space-cadet": "#262E57",
      "light-cyan": "#DAF2F7",
      "light-blue": "#AECCCF",
      "mint-green": "#D1F8F3",
      "delft-blue": "#373F62",
      "celeste": "#B6E7E0",
      "light-cyan-2": "#D7F3FD",
      "misty-rose": "#FDE5DE",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const router = useRouter();
 
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };
 
    router.events.on("routeChangeComplete", handleRouteChange);
 
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-TKK9MLSFV1"></Script>
        <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TKK9MLSFV1', {
                page_path: window.location.pathname,
            });
          `,
        }}
      />
      <ChakraProvider theme={theme}>
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
          <Navbar />
          <Component {...pageProps} />
        </SessionContextProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
