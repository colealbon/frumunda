import React, {
  ChangeEvent,
  useState,
  useCallback,
} from 'react';
import { TextField } from '@mui/material';
import { useCorsProxies } from '../react-hooks/useCorsProxies'

const CorsProxiesAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const { corsProxies, publishCorsProxies, inFlight } = useCorsProxies()

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addCorsProxyCallback = useCallback(() => {
    const newCorsProxy = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    const newCorsProxiesClone = { ...newCorsProxy, ...JSON.parse(JSON.stringify(corsProxies)) }
    publishCorsProxies(newCorsProxiesClone);
  }, [ corsProxies, publishCorsProxies, inputValue]);

  return (
      <TextField
        disabled={inFlight}
        id="addCorsProxyTextField"
        placeholder="add cors proxy here"
        value={inputValue}
        onKeyPress={(event: {key: string}) => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addCorsProxyCallback();
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
