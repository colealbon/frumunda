import React, { FunctionComponent } from 'react';
import { useFeeds } from '../react-hooks/useFeeds'
import { Card, CardContent } from '@mui/material';

import FeedsAdd from './FeedsAdd';
import FeedsReset from './FeedsReset';
import FeedCategories from './FeedCategories';
import FeedToggle from './FeedToggle';
import FeedDelete from './FeedDelete';

const FeedsEdit: FunctionComponent = () => {
  const { feeds } = useFeeds()

  return (
    <>
      <FeedsAdd/>
      <div /> 
      <FeedsReset />
      <div />
      {Object.keys(JSON.parse(JSON.stringify(feeds))).map(feed => {
        return (
          <Card variant="outlined" key={`feed-edit-${feed}`}>
            <CardContent>
              <div>
                <FeedToggle text={feed} />
                <FeedDelete text={feed} />
              </div>
              <FeedCategories text={feed} />
            </CardContent>
          </Card>
        );
      })}
    </>
  )
};

export default FeedsEdit;