import { Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { DeveloperZKP, SignalData, ZKPSignal } from "./Registration/BidRegistration";

const DevData: React.FC<{ devZKP: DeveloperZKP, title: string }> = ({ devZKP, title }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signals, setSignals] = useState<SignalData>({
    disclosedRate: '',
    disclosedAvailability: '',
    disclosedSkills: '',
    disclosedResumeFileName: '',
    disclosedExclusions: '',
    rateHash: BigInt(0),
    availabilityHash: BigInt(0),
    skillsHash: BigInt(0),
    resumeFileNameHash: BigInt(0),
    exclusionsHash: BigInt(0),
  });
  
  const signalKeys = Object.keys(signals);

  useEffect(() => {
    if (devZKP && devZKP.signals) {
      let newSignals = { ...signals };
      devZKP.signals.forEach((signal, index) => {
        if (index > 0 && index < 5) {
          newSignals = {
            ...newSignals,
            [signalKeys[index]]: numberToString(signal),
          };
        } else {
          newSignals = {
            ...newSignals,
            [signalKeys[index]]: signal,
          };
        }
      });
      setSignals(newSignals);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devZKP]);  
  
  return (
    <>
      <Button onClick={onOpen}>View ZKP</Button>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>

          <DrawerBody>
            <pre>{JSON.stringify(signals, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const numberToString = (num: BigInt) => {
  const str = num.toString();
  let result = '';
  for(let i = 0; i < str.length; i += 3) {
    const asciiValue = parseInt(str.slice(i, i+3), 10);
    if (!isNaN(asciiValue)) {
      result += String.fromCharCode(asciiValue);
    }
  }
  return result === '\u0000' ? 'hidden' : result;
}

export default DevData;
