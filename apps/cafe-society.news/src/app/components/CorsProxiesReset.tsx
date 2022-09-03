import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json';
import { useStorage } from '../react-hooks/useStorage';
import { mutate } from 'swr';
const CorsProxiesReset: FunctionComponent = () => {
  const { persistLocal } = useStorage();
  const factoryReset = () => {
    mutate('corsProxies', persistLocal('corsProxies', defaultCorsProxies), {
      optimisticData: defaultCorsProxies,
    });
  };

  return (
    <Button key="corsProxiesreset" onClick={() => factoryReset()}>
      reset corsProxies
    </Button>
  );
};
export default CorsProxiesReset;
