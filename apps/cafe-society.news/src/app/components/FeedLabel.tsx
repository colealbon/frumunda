import { ChangeEvent, useState, useCallback, FunctionComponent } from 'react';
import useSWR, { mutate } from 'swr';
import { useStacks } from '../react-hooks/useStacks';
import { TextField } from '@mui/material';

type Props = { text: string };

const FeedLabelEdit: FunctionComponent<Props> = ({ text }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [inFlight, setInFlight] = useState(false);
  const { data: feeds } = useSWR('feeds');
  const { persist } = useStacks();

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
      placeholder={`${defaultFeedLabel}`}
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
