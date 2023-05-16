import Image from 'next/image'
import logo from '../assets/logo.png'

interface LogoProps {
  h: number;
  w: number;
}

const Logo: React.FC<LogoProps> = ({ h, w }) => {
  return (
    <Image
      src={logo}
      alt="ContractCanvas Logo"
      height={h}
      width={w}
    />
  )
}

export default Logo;
