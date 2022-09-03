import { FunctionComponent } from 'react';
import { mutate } from 'swr';
import Button from '@mui/material/Button';
import defaultFeeds from '../react-hooks/defaultFeeds.json';
import { useStorage } from '../react-hooks/useStorage';

const FeedsReset: FunctionComponent = () => {
  const { persistLocal } = useStorage();
  return (
    <Button
      key="feedsreset"
      onClick={() => () => {
        console.log(defaultFeeds)
        mutate('feeds', persistLocal('feeds', defaultFeeds), {
          optimisticData: defaultFeeds,
        });
      }}
    >
      reset feeds
    </Button>
  );
};
export default FeedsReset;
