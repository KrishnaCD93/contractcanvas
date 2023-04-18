import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app'
import { Navbar } from '@/components/Navbar';

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session,
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <ChakraProvider>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Navbar />
        <Component {...pageProps} />
      </SessionContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
