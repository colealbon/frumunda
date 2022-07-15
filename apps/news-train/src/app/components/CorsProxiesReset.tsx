import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { useCorsProxies } from '../react-hooks/useCorsProxies';

const CorsProxiesReset: FunctionComponent = () => {
  const { factoryReset, inFlight } = useCorsProxies();
  return (
    <Button key="corsProxiesreset" disabled={inFlight} onClick={() => factoryReset()}>
      reset cors proxies
    </Button>
  );
};
export default CorsProxiesReset;
