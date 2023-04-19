// pages/dashboard.tsx
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" minH="80vh">
      <Heading as="h1" size="xl" mb={4}>
        Dashboard
      </Heading>
      {session?.user && (
        <>
          <Text fontSize="lg" fontWeight="medium">
            Welcome, {session.user.user_metadata.full_name}!
          </Text>
          <Text mt={2}>
            You have successfully logged in. Add your dashboard content here.
          </Text>
        </>
      )}
    </Flex>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
    },
  };
}

export default Dashboard;
