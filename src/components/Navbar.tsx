// components/Navbar.tsx
import { Box, Flex, Heading, HStack, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/supabase';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const [userName, setUserName] = useState<string | null>(null);

  const session = useSession();
  const router = useRouter();

  async function fetchUserName(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user name:', error.message);
    } else {
      setUserName(data.full_name);
    }
  }

  
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  const user = session?.user;
  
  useEffect(() => {
    console.log('user', userName)
    console.log('session', session)
    if (session?.user) {
      fetchUserName(session.user.id);
    }
  }, [session, userName]);

  return (
    <Box bg="teal.500" px={4} py={2}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Heading as="h1" size="md" cursor="pointer" onClick={() => router.push('/')}>
          ContractCanvas
        </Heading>
        <HStack spacing={8} alignItems={'center'}>
          <HStack as="nav" spacing={4}>
            <Link href="/" color="white">
              Home
            </Link>
            <Link href="/projects" color="white">
              Projects
            </Link>
            {user ? (
              <>
                <Link href="/profile" color="white">
                  {userName || user.email}
                </Link>
                <Link onClick={logout} color="white">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" color="white">
                  Register
                </Link>
                <Link href="/login" color="white">
                  Login
                </Link>
              </>
            )}
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};
