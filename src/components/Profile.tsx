import { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Image } from '@chakra-ui/react';
import { supabase } from '../supabase';
import { useToast } from '@chakra-ui/react';

interface ProfileState {
  id: string;
  name: string;
  email: string;
  userType: string;
  avatarUrl: string | null;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileState>({
    id: '',
    name: '',
    email: '',
    userType: '',
    avatarUrl: null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const toast = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfileData({
            id: data.id,
            name: data.full_name as string,
            email: user.email as string,
            userType: data.user_type as string,
            avatarUrl: data.avatar_url,
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
    .from('profiles')
    .update({
      full_name: profileData.name,
      user_type: profileData.userType,
    })
    .eq('id', profileData.id);

  if (error) {
    console.error('Error updating user data:', error.message);
  } else {
    toast({
      title: "Profile updated.",
      description: "Your profile has been updated.",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  }
};

const handleAvatarUpload = async () => {
  if (fileInputRef.current && fileInputRef.current.files) {
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileData.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError.message);
    } else {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', profileData.id);

      if (updateError) {
        console.error('Error updating avatar URL:', updateError.message);
      } else {
        const newAvatarUrl = supabase.storage.from('avatars').getPublicUrl(filePath);
        setProfileData({ ...profileData, avatarUrl: newAvatarUrl.data.publicUrl });
      }
    }
  }
};

return (
  <Box>
    <Image
      borderRadius="full"
      boxSize=      "150px"
      src={profileData.avatarUrl || 'https://via.placeholder.com/150'}
      alt="Avatar"
      mb={4}
    />
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handleAvatarUpload}
    />
    <Button onClick={() => fileInputRef.current?.click()} mb={4}>
      Upload Avatar
    </Button>
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            required
            disabled
          />
        </FormControl>
        <FormControl>
          <FormLabel>User Type</FormLabel>
          <Input
            type="text"
            name="userType"
            value={profileData.userType}
            onChange={handleChange}
            required
          />
        </FormControl>
        <Button type="submit">Update Profile</Button>
      </VStack>
    </form>
  </Box>
);
};

export default Profile;