import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { useStorage } from '../react-hooks/useStorage';
import defaultDispatchers from '../react-hooks/defaultDispatchers.json'
import {mutate} from 'swr';


const DispatchersReset: FunctionComponent = () => {
  const { persist } = useStorage();
  return (
    <Button key="dispatchersreset" onClick={() => {
      mutate('dispatchers', persist('dispatchers', defaultDispatchers), {
        optimisticData: defaultDispatchers,
      })
    }}>
      reset dispatchers
    </Button>
  );
};
export default DispatchersReset;
