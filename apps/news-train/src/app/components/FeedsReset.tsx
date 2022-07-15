import React, { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import { useFeeds } from '../react-hooks/useFeeds';

const FeedsReset: FunctionComponent = () => {
  const { factoryReset, inFlight } = useFeeds();
  return (
    <Button key="feedsreset" disabled={inFlight} onClick={() => factoryReset()}>
      reset feeds
    </Button>
  );
};
export default FeedsReset;
