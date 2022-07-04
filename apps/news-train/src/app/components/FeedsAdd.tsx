import React, {
  ChangeEvent,
  useState,
  useCallback,
} from 'react';
import { TextField } from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds'

const FeedsAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const { feeds, persistFeeds, inFlight } = useFeeds()

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addFeedCallback = useCallback(() => {
    const newFeed = JSON.parse(`{"${inputValue}": {"checked": true, "categories": []}}`);
    const newFeedsClone = { ...newFeed, ...JSON.parse(JSON.stringify(feeds)) }
    persistFeeds(newFeedsClone);
  }, [ feeds, persistFeeds, inputValue]);

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
              addFeedCallback();
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
