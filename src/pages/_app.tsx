// pages/_app.tsx
import * as React from 'react';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
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
    brand: {
      "white-2": "#FFFFFFff",
      "white": "#FDFDFEff",
      "light-cyan": "#DAF2F7",
      "light-cyan-2": "#D7F3FD",
      "light-blue": "#AECCCF",
      "mint-green": "#D1F8F3",
      "celeste": "#B6E7E0",
      "misty-rose": "#FDE5DE",
      "cool-gray": "#7D859B",
      "space-cadet": "#262E57",
      "delft-blue": "#373F62",
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
          <Box bg="brand.white" minH="100vh" pb={8}>
            <Navbar />
            <Component {...pageProps} />
          </Box>
        </SessionContextProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
