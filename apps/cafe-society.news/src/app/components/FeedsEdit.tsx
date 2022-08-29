import { FunctionComponent, useState } from 'react';
import useSWR from 'swr';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import FeedsAdd from './FeedsAdd';
import FeedsReset from './FeedsReset';
import FeedCategories from './FeedCategories';
import FeedToggle from './FeedToggle';
import FeedDelete from './FeedDelete';
import FeedLabel from './FeedLabel';
import { useStacks } from '../react-hooks/useStacks';
import defaultFeeds from '../react-hooks/defaultFeeds.json';

const FeedsEdit: FunctionComponent = () => {
  const { fetchFileLocal } = useStacks();

  const [expanded, setExpanded] = useState<string | false>('');
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const { data: feedsdata } = useSWR(
    'feeds',
    fetchFileLocal('feeds', defaultFeeds)
  );
  const feeds = { ...(feedsdata as object) };
  return (
    <>
      <FeedsAdd />
      <div />
      <FeedsReset />
      <div />
      {Object.keys({ ...feeds }).map((feed) => {
        return (
          <Accordion 
            style={{padding: '0px'}}
            expanded={expanded === feed}
            onChange={handleChange(feed)}
          >
            <AccordionSummary style={{justifyContent: 'start', padding: '0px', overflow: 'auto'}} >
              {feed}
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <FeedDelete text={feed} />
                <FeedToggle text={feed} />
              </div>
              <div>
                <FeedCategories text={feed} />
              </div>
              <FeedLabel text={feed} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default FeedsEdit;
