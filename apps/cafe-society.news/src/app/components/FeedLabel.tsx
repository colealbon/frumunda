import { ChangeEvent, useState, useCallback, FunctionComponent } from 'react';
import useSWR, { mutate } from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import { TextField } from '@mui/material';
import defaultFeeds from '../react-hooks/defaultFeeds.json';

type Props = { text: string };

const FeedLabelEdit: FunctionComponent<Props> = ({ text }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [inFlight, setInFlight] = useState(false);
  const { persist, fetchFileLocal } = useStorage();
  const { data: feedsdata } = useSWR('feeds', fetchFileLocal('feeds', {}), {
    fallbackData: defaultFeeds,
  });
  const feeds = { ...(feedsdata as object) };

  const defaultFeedLabel =
    Object.entries(feeds as object)
      .filter((feedItem) => {
        return feedItem[0] === text;
      })
      .map((feedItem) =>
        Object.entries(feedItem[1])
          .filter((feedItemAttribute) => feedItemAttribute[0] === 'label')
          .map((feedItemAttribute) => feedItemAttribute[1])
      )
      .flat(Infinity)
      .find(() => true) || 'Add feed label here (optional)';

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const setFeedLabel = () => {
    const newFeed = Object.fromEntries(
      Object.entries(feeds as object)
        .filter((feedItem) => feedItem[0] === text)
        .map((feedItem) => [
          feedItem[0],
          { ...feedItem[1], ...{ label: `${inputValue}` } },
        ])
    );
    const newFeeds = { ...feeds, ...newFeed };
    setInFlight(true)
    mutate('feeds', persist('feeds', newFeeds), { optimisticData: newFeeds })
    .then(() => setInFlight(false))
  };

  return (
    <TextField
      label={`${defaultFeedLabel}`}
      disabled={inFlight}
      id="editFeedLabelTextField"
      placeholder={'Add feed label here (optional)'}
      value={inputValue}
      onKeyPress={(event: { key: string }) => {
        [event.key]
          .filter((theKey) => theKey === 'Enter')
          .forEach(() => {
            setFeedLabel();
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

export default FeedLabelEdit;
