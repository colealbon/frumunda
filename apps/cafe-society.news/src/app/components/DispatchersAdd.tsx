import { ChangeEvent, useState, useCallback } from 'react';
import { useStorage } from '../react-hooks/useStorage';
import { TextField } from '@mui/material';
import useSWR, { mutate } from 'swr';

const DispatchersAdd = () => {
  const { data: dispatchers } = useSWR('dispatchers');
  const [inFlight, setInFlight] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { persistLocal } = useStorage();

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addDispatcher = () => {
    setInFlight(true);
    const newDispatcher = JSON.parse(`{"${inputValue}": {"checked": true}}`);
    const newDispatchers = { ...newDispatcher, ...dispatchers };
    mutate('dispatchers', persistLocal('dispatchers', newDispatchers), {
      optimisticData: newDispatchers,
      rollbackOnError: false
    }).then(() => setInFlight(false));
  };

  return (
    <TextField
      disabled={inFlight}
      id="addDispatcherTextField"
      placeholder="add dispatcher name here"
      value={inputValue}
      onKeyPress={(event: { key: string }) => {
        [event.key]
          .filter((theKey) => theKey === 'Enter')
          .forEach(() => {
            addDispatcher();
            setInputCallback('');
          });
      }}
      onChange={(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setInputCallback(event.target.value);
      }}
      fullWidth
    />
  );
};

export default DispatchersAdd;
