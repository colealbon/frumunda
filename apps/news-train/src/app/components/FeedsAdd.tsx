import {
  ChangeEvent,
  useState,
  useCallback,
} from 'react';
import useSWR, {mutate} from 'swr';
import { TextField } from '@mui/material';
import { useStacks } from '../react-hooks/useStacks';

const FeedsAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const [inFlight, setInFlight] = useState(false);
  const { data: feeds } = useSWR('feeds');
  const {persist} = useStacks();

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addFeed = () => {
    const newFeed = JSON.parse(`{"${inputValue}": {"checked": true, "categories": []}}`);
    const newFeeds = { ...newFeed, ...feeds };
    setInFlight(true);
    mutate('feeds', persist('feeds', newFeeds), {optimisticData: newFeeds})
    .then(() => setInFlight(false));
  };

  return (
      <TextField
        disabled={inFlight}
        id="addFeedTextField"
        placeholder="add feed here"
        value={inputValue}
        onKeyPress={(event: {key: string}) => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addFeed();
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

export default FeedsAdd;
