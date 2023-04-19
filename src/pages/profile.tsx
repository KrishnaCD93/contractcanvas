// pages/profile.tsx
import { GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Image } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useToast } from '@chakra-ui/react';

interface ProfileState {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  avatar_url: string | null;
}

interface ProfileProps {
  user: ProfileState;
}

const Profile = ({ user }: ProfileProps) => {
  const supabase = useSupabaseClient();
  const [profileData, setProfileData] = useState<ProfileState>({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    user_type: user.user_type,
    avatar_url: user.avatar_url || null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.full_name,
        user_type: profileData.user_type,
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
      });
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
          setProfileData({ ...profileData, avatar_url: newAvatarUrl.data.publicUrl });
        }
      }
    }
  };

  return (
    <Box>
      <Image
        borderRadius="full"
        boxSize="150px"
        src={profileData.avatar_url || 'https://via.placeholder.com/150'}
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
          name="full_name"
          value={profileData.full_name}
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
          name="user_type"
          value={profileData.user_type}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);
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

  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
  }

  return {
    props: {
      initialSession: session,
      user: userProfile,
    },
  };
};
