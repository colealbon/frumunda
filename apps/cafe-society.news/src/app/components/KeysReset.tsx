import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { useStacks } from '../react-hooks/useStacks';
import defaultKeys from '../react-hooks/defaultKeys.json'
import {mutate} from 'swr';


const KeysReset: FunctionComponent = () => {
  const { persist } = useStacks();
  return (
    <Button key="keysreset" onClick={() => {
      mutate('keys', persist('keys', defaultKeys), {
        optimisticData: defaultKeys,
      })
    }}>
      reset keys
    </Button>
  );
};
export default KeysReset;
