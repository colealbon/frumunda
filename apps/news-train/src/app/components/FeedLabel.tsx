import React, {
  ChangeEvent,
  useState,
  useCallback,
  FunctionComponent
} from 'react';
import { TextField } from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds'

type Props = {text: string}

const FeedLabelEdit: FunctionComponent<Props> = ({text}: Props) => {
  const [inputValue, setInputValue] = useState('');
  const { feeds, persistFeeds, inFlight } = useFeeds()

  const defaultFeedLabel = Object.entries(feeds as object)
    .filter(feedItem => {
        return feedItem[0] === text
    })
    .map(feedItem => Object.entries(feedItem[1])
        .filter(feedItemAttribute => feedItemAttribute[0] === 'label')
        .map(feedItemAttribute => feedItemAttribute[1])
    )
    .flat(Infinity)
    .find(() => true) || 'Add feed label here (optional)'

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const setFeedLabelCallback = useCallback(() => {
    const newFeed = Object.fromEntries(Object.entries(feeds as object)
      .filter(feedItem => feedItem[0] === text)
      .map(feedItem => [feedItem[0], {...feedItem[1], ...{label: `${inputValue}`}}])
    )
    const newFeedsClone = structuredClone({ ...feeds as object, ...newFeed})
    persistFeeds(newFeedsClone);
  }, [ feeds, persistFeeds, inputValue, text]);

  return (
      <TextField
        label={`${defaultFeedLabel}`}
        disabled={inFlight}
        id="editFeedLabelTextField"
        placeholder={`${defaultFeedLabel}`}
        value={inputValue}
        onKeyPress={(event: {key: string}) => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              setFeedLabelCallback();
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

export default FeedLabelEdit;
