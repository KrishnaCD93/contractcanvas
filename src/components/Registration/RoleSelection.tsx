// /components/Registration/RoleSelection.tsx
import React from 'react';
import { Field } from 'formik';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  FormHelperText,
} from '@chakra-ui/react';

interface RoleSelectionProps {
  setFieldValue: (field: string, value: any) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  setFieldValue,
}) => {
  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">Role</FormLabel>
      <Field name="userType">
        {({ field }: any) => (
          <RadioGroup
            {...field}
            onChange={(value) => setFieldValue('userType', value)}
          >
            <Stack direction="row">
              <Radio value="client">Client</Radio>
              <Radio value="developer">Developer</Radio>
              <Radio value="none">None</Radio>
            </Stack>
          </RadioGroup>
        )}
      </Field>
      <FormHelperText>
        How would you like to use ContractCanvas?
      </FormHelperText>
    </FormControl>
  );
};

export default RoleSelection;
