// components/Portfolio/PortfolioItemForm.tsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

interface PortfolioItemFormProps {
  refreshItems: () => void;
  user: any;
}

const PortfolioItemForm: React.FC<PortfolioItemFormProps> = ({ refreshItems, user }) => {
  const supabaseClient = useSupabaseClient();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    protectedIp: false
  });
  const toast = useToast();

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const portfolioItem = {
      title: formData.title,
      link: formData.link,
      protectedIp: formData.protectedIp,
    };
  
    const { data, error } = await supabaseClient.from('portfolio_items').insert([portfolioItem]);
  
    if (error) {
      toast({
        title: 'Error creating portfolio item.',
        description: 'There was an error creating your portfolio item.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else if (data) {
      // Add the new portfolio item id to the user's metadata
      // const newItemId = data[0].id;
      // const updatedMetadata = {
      //   ...user.user_metadata,
      //   portfolio_item_ids: newItemId ? [...user.user_metadata.portfolio_item_ids, newItemId] : user.user_metadata.portfolio_item_ids,
      // };      
      // // Update the user's metadata in the database
      // await supabaseClient.from('users').update({ user_metadata: updatedMetadata }).eq('id', user.id);

      toast({
        title: 'Portfolio item created.',
        description: 'Your portfolio item was created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        title: '',
        link: '',
        protectedIp: false,
      });
      refreshItems();
    }
  };  

  return (
    <Box boxShadow="lg" p={8} borderRadius="md" borderWidth={1}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Link</FormLabel>
            <Textarea
              name="link"
              value={formData.link}
              onChange={handleFormChange}
              required
            />
          </FormControl>
          <Button type="submit">Add Portfolio Item</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default PortfolioItemForm;
