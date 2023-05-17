// components/Navbar.tsx
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Button,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/../types_db';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export const Navbar = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useUser();
  const router = useRouter();

  const supabaseClient = useSupabaseClient<Database>();

  const fetchData = useCallback( async function fetchUserData(userId: string) {
    setUserName(user?.user_metadata.full_name || null);
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user data:', error.message);
    } else {
      setUserName(data.full_name);
      setAvatarUrl(data.avatar_url);
    }
  }, [supabaseClient, user]);

  const logout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    if (user) {
      fetchData(user.id);
    }
  }, [user, fetchData]);
  return (
    <Box
      bg='brand.mint-green'
      px={4}
      py={2}
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Heading
          as="h1"
          size="md"
          cursor="pointer"
          onClick={() => router.push('/')}
          color='brand.space-cadet'
        >
          ContractCanvas
        </Heading>
        <IconButton
          display={['flex', 'none']}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        />
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay>
          <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader color="brand.delft-blue" borderBottomWidth="1px">
                ContractCanvas
              </DrawerHeader>
              <DrawerBody>
                <VStack
                  spacing={4}
                  align="stretch"
                >
                  <Link href="/">Home</Link>
                  <Link href="/projects">Projects</Link>
                  <Link href="/about">About</Link>
                  {user ? (
                    <>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<FiChevronDown />}
                          size="sm"
                          variant="ghost"
                        >
                          {avatarUrl ? (
                            <Avatar size="sm" src={avatarUrl} />
                          ) : (
                            userName?.split(' ').map((name) => name[0]).join('')
                          )}
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => router.push('/project-registration')}>
                            New Project
                          </MenuItem>
                          <MenuDivider />
                          <MenuItem onClick={() => router.push('/profile')}>
                            Profile
                          </MenuItem>
                          <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Link href="/register">Register</Link>
                      <Link href="/login">Login</Link>
                    </>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
        <HStack
          as="nav"
          spacing={4}
          display={['none', 'flex']}
        >
          <Link href="/" color='brand.space-cadet'>
            Home
          </Link>
          <Link href="/projects" color='brand.space-cadet'>
            Projects
          </Link>
          <Link href="/about" color='brand.space-cadet'>
            About
          </Link>
          {user ? (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="sm"
                  variant="ghost"
                  color={'brand.space-cadet'}
                >
                  {avatarUrl ? (
                    <Avatar size="sm" src={avatarUrl} />
                  ) : (
                    userName?.split(' ').map((name) => name[0]).join('')
                  )}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => router.push('/contract-registration')}>
                    New Contract
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => router.push('/profile')}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/register" color='brand.space-cadet'>
                Register
              </Link>
              <Link href="/login" color='brand.space-cadet'>
                Login
              </Link>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

//   return (
//     <Box bg="teal.500" px={4} py={2}>
//       <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
//         <Heading
//           as="h1"
//           size="md"
//           cursor="pointer"
//           onClick={() => router.push('/')}
//         >
//           ContractCanvas
//         </Heading>
//         <HStack spacing={8} alignItems={'center'}>
//           <HStack as="nav" spacing={4}>
//             <Link href="/" color="white">
//               Home
//             </Link>
//             <Link href="/projects" color="white">
//               Projects
//             </Link>
//             <Link href="/about" color="white">
//               About
//             </Link>
//             {user ? (
//               <>
//                 <Menu>
//                   <MenuButton
//                     as={Button}
//                     rightIcon={<FiChevronDown />}
//                     size="sm"
//                     variant="ghost"
//                   >
//                     {avatarUrl ? <Avatar
//                       size="sm"
//                       src={avatarUrl}
//                     /> : 
//                   userName?.split(' ').map((name) => name[0]).join('')}
//                   </MenuButton>
//                   <MenuList>
//                     <MenuItem onClick={() => router.push('/contract-registration')}>
//                       New Contract
//                     </MenuItem>
//                     <MenuDivider />
//                     <MenuItem onClick={() => router.push('/profile')}>
//                       Profile
//                     </MenuItem>
//                     <MenuItem onClick={logout}>Logout</MenuItem>
//                   </MenuList>
//                 </Menu>
//               </>
//             ) : (
//               <>
//                 <Link href="/register" color="white">
//                   Register
//                 </Link>
//                 <Link href="/login" color="white">
//                   Login
//                 </Link>
//               </>
//             )}
//           </HStack>
//         </HStack>
//       </Flex>
//     </Box>
//   );
// };
