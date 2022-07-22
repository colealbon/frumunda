import { FunctionComponent } from 'react';
import { mutate } from 'swr'
import Button from '@mui/material/Button';
import defaultFeeds from '../react-hooks/defaultFeeds.json'
import {useStacks} from '../react-hooks/useStacks'

const FeedsReset: FunctionComponent = () => {
  const {persist} = useStacks()
  return (
    <Button key="feedsreset" onClick={() => () => {
      mutate(
        'feeds',
        persist('feeds', defaultFeeds),
        {optimisticData: defaultFeeds}
      )}
    }>
      reset feeds
    </Button>
  );
};
export default FeedsReset;
