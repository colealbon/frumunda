import { ChangeEvent, useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { TextField } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';
import { feedType } from '../types'

const FeedsAdd = () => {
  const [inputValue, setInputValue] = useState('');
  const [inFlight, setInFlight] = useState(false);
  const { data: feeds } = useSWR('feeds');
  const { persistLocal } = useStorage();

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addFeed = () => {
    const newFeed: feedType = JSON.parse(
      `{"${inputValue}": {"checked": true, "categories": []}}`
    );
    const newFeeds = { ...newFeed, ...feeds };
    setInFlight(true);
    mutate('feeds', persistLocal('feeds', newFeeds), {
      optimisticData: newFeeds,
    }).then(() => {
      setInputCallback('')
      setInFlight(false)
    })
  };

  const handlersForKeyPress: {[key: string]: () => void} = {
    "Enter": () => addFeed()
  }

  const onKeyPress: (event: { key: string;}) => void = (event) => {
    return handlersForKeyPress[event.key]()
  }

  const onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void = ((event) => {
    return setInputCallback(event.target.value);
  })

  return (
    <TextField
      disabled={inFlight}
      id="addFeedTextField"
      title="add feed here"
      placeholder="add feed here"
      value={inputValue}
      onKeyPress={onKeyPress}
      onChange={onChange}
      fullWidth
    />
  );
};

export default FeedsAdd;
