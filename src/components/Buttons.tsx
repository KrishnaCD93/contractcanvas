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
      bg="brand.dark-orange"
      color="brand.celeste"
      _hover={{ bg: "brand.space-cadet", color: "brand.mint-green" }}
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
      bg="brand.celeste"
      color="brand.space-cadet"
      _hover={{ bg: "brand.misty-rose", color: "brand.space-cadet" }}
      onClick={() => Router.push(props.route)}
    >
      {props.text}
    </Button>
  )
}

export { PrimaryButton, SecondaryButton };