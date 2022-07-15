import { FunctionComponent } from 'react';
import { useFeeds } from '../react-hooks/useFeeds'
import { Card, CardContent } from '@mui/material';

import FeedsAdd from './FeedsAdd';
import FeedsReset from './FeedsReset';
import FeedCategories from './FeedCategories';
import FeedToggle from './FeedToggle';
import FeedDelete from './FeedDelete';
import FeedLabel from './FeedLabel';

const FeedsEdit: FunctionComponent = () => {
  const { feeds } = useFeeds()

  return (
    <>
      <FeedsAdd/>
      <div /> 
      <FeedsReset />
      <div />
      {Object.keys(feeds as object).map(feed => {
        return (
          <Card variant="outlined" key={`feed-edit-${feed}`}>
            <CardContent>
              <div>
                <FeedDelete text={feed} />
                <FeedToggle text={feed} />
                
              </div>
              <div>
              <FeedCategories text={feed} />
              </div>
              <CardContent>
                <FeedLabel text={feed} />
              </CardContent>
            </CardContent>
          </Card>
        );
      })}
    </>
  )
};

export default FeedsEdit;