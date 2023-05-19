import ProjectRegistrationForm, { ProjectItemsToUpload } from "@/components/Registration/ProjectRegistration";
import { Box, useToast } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const ProjectRegistration = () => {
  const user = useUser();
  const router = useRouter();
  const toast = useToast();
  const projectRef = useRef<HTMLDivElement>(null);
  const [projectItemsToUpload, setProjectItemsToUpload] = useState<ProjectItemsToUpload>();

  const uploadProjectItems = async (database: string, values: any[]) => {
    const response = await fetch(`/api/supabase-fetch?database=${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });
  
    const { result } = await response.json();
    console.log('Uploaded dev data:', result);
    return result;
  };

  useEffect(() => {
    if (!user) {
      router.push('/client-register');
    }
  }, [user, router]);  

  useEffect(() => {
      if (projectItemsToUpload) {
      console.log('project', projectItemsToUpload)
      const projectItemsToUploadWithUserId = {
        ...projectItemsToUpload,
        user_id: user?.id,
      }
      const projectIds = uploadProjectItems('projects', [projectItemsToUploadWithUserId]);
      console.log('projectIds', projectIds)
      toast({
        title: "Project uploaded.",
        description: "Your project has been uploaded.",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
      router.push('/projects')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectItemsToUpload, user?.id]);

  if (user) {
    return (
      <Box my={2}>
        <ProjectRegistrationForm
          forwardRef={projectRef}
          setProjectItemsToUpload={setProjectItemsToUpload}
          step={0}
          setStep={()=>{}}
          setProgressPercent={()=>{}}
        />
      </Box>
    )
  }
}

export default ProjectRegistration;