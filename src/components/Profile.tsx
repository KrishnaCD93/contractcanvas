// components/Profile.tsx
import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { supabase } from '../supabase';
import { useToast } from '@chakra-ui/react';

interface ProfileState {
  id: string;
  name: string;
  email: string;
  userType: string;
}

export const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileState>({
    id: '',
    name: '',
    email: '',
    userType: '',
  });
  
  const toast = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (data) {
          setProfileData({
            id: data.id,
            name: data.name,
            email: data.email,
            userType: data.user_type,
          });
        } else {
          console.error('Error fetching user data:', error?.message);
        }
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
    .from('users')
    .update({
      name: profileData.name,
      email: profileData.email,
      user_type: profileData.userType,
    })
    .eq('id', profileData.id);

  if (error) {
    console.error('Error updating user data:', error.message);
  } else {
    // Display a success message or perform any necessary actions after a successful update
    console.log('User data updated successfully');
    toast({
      title: "Profile updated.",
      description: "Your profile has been updated.",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  }
};

return (
  <Box>
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" value={profileData.name} onChange={handleChange} required />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={profileData.email} onChange={handleChange} required />
        </FormControl>
        <FormControl>
          <FormLabel>User Type</FormLabel>
          <Input type="text" name="userType" value={profileData.userType} onChange={handleChange} required />
        </FormControl>
        <Button type="submit">Update Profile</Button>
      </VStack>
    </form>
  </Box>
);
};
