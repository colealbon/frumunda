import { FunctionComponent } from 'react';
import useSWR from 'swr'
import { Card, CardContent } from '@mui/material';
import FeedsAdd from './FeedsAdd';
import FeedsReset from './FeedsReset';
import FeedCategories from './FeedCategories';
import FeedToggle from './FeedToggle';
import FeedDelete from './FeedDelete';
import FeedLabel from './FeedLabel';
import {useStacks} from '../react-hooks/useStacks'
import defaultFeeds from '../react-hooks/defaultFeeds.json'

const FeedsEdit: FunctionComponent = () => {
  const {fetchFileLocal} = useStacks()

  const { data: feedsdata } = useSWR('feeds', () => fetchFileLocal('feeds', defaultFeeds))
  const feeds = {...feedsdata as object}
  return (
    <div style={{display: 'flex', flexDirection: 'column', maxWidth: '300px'}}>

      <FeedsAdd/>
      <div /> 
      <FeedsReset />
      <div />
      {Object.keys({...feeds}).map(feed => {
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
     </div>
  )
};

export default FeedsEdit;