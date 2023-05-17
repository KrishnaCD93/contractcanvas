// /src/components/Buttons.tsx
import { Button } from "@chakra-ui/react"
import { useRouter } from "next/router";

interface ButtonProps {
  route: string;
  text: string;
}

const PrimaryButton: React.FC<ButtonProps> = ({ ...props }) => {
  const router = useRouter();

  return (
    <Button
      size="lg"
      bg="brand.mint-green"
      color="brand.space-cadet"
      onClick={() => router.push(props.route)}
    >
      {props.text}
    </Button>
  )
}

const SecondaryButton: React.FC<ButtonProps> = ({ ...props }) => {
  const Router = useRouter();

  return (
    <Button
      size="lg"
      variant="outline"
      borderColor="brand.light-cyan"
      color="brand.space-cadet"
      _hover={{ bg: "brand.light-cyan-2", color: "brand.space-cadet" }}
      onClick={() => Router.push(props.route)}
    >
      {props.text}
    </Button>
  )
}

export { PrimaryButton, SecondaryButton };