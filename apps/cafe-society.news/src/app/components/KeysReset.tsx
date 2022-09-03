import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { useStorage } from '../react-hooks/useStorage';
import defaultKeys from '../react-hooks/defaultKeys.json'
import {mutate} from 'swr';


const KeysReset: FunctionComponent = () => {
  const { persist } = useStorage();
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
