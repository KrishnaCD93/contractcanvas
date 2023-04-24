import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser, useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import PortfolioItemForm from "../components/Portfolio/PortfolioItemForm";

const Dashboard = () => {
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  const fetchPortfolioItems = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabaseClient
      .from("portfolio_items")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.log("Error fetching portfolio items:", error.message);
    } else {
      setPortfolioItems(data);
    }
  }, [session, supabaseClient]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      fetchPortfolioItems();
    }
  }, [session, router, fetchPortfolioItems]);

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
          <VStack spacing={4} mt={4} w="100%">
          <PortfolioItemForm refreshItems={fetchPortfolioItems} user={session.user} />
            <SimpleGrid columns={3} spacing={4}>
              {portfolioItems.map((item) => (
                <Box key={item.id} borderWidth={1} borderRadius="md" p={4}>
                  <Heading as="h3" size="md" mb={2}>
                    {item.title}
                  </Heading>
                  <Text>{item.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
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
        destination: "/login",
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
