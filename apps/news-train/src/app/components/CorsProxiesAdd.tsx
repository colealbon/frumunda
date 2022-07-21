import {
  ChangeEvent,
  useState,
  useCallback
} from 'react';
import { useStacks } from '../react-hooks/useStacks'
import { TextField } from '@mui/material';
import useSWR, { mutate } from 'swr';

const CorsProxiesAdd = () => {
  const {data: corsProxies} = useSWR('corsProxies')
  const [inFlight, setInFlight] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const {persist} = useStacks()

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addCorsProxy = () => {
    setInFlight(true)
    const newCorsProxy = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    const newCorsProxies = { ...newCorsProxy, ...corsProxies }
    mutate(
      'corsProxies', 
      persist('corsProxies', newCorsProxies), 
      { optimisticData: newCorsProxies, rollbackOnError: true }
    ).then(() => setInFlight(false))
  }

  return (
    <TextField
      disabled={inFlight}
      id="addCorsProxyTextField"
      placeholder="add corsProxy here"
      value={inputValue}
      onKeyPress={(event: {key: string}) => {
        [event.key]
          .filter(theKey => theKey === 'Enter')
          .forEach(() => {
            addCorsProxy();
            setInputCallback('');
          });
      }}
      onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputCallback(event.target.value);
      }}
      fullWidth
    />
  );
};

export default CorsProxiesAdd;
