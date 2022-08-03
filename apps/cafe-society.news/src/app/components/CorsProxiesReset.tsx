import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json';
import { useStacks } from '../react-hooks/useStacks';
import { mutate } from 'swr';
const CorsProxiesReset: FunctionComponent = () => {
  const { persistLocal } = useStacks();
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
