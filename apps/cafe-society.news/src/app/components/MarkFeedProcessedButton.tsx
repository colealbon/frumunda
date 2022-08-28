import { useContext, FunctionComponent, useState } from 'react';
import { mutate } from 'swr';
import { IconButton, Typography} from '@mui/material';
import { RemoveDone } from '@mui/icons-material';
import { cleanPostItem, removePunctuation, shortUrl, hashStr } from '../utils';
import { cleanPostItemType, feedValueType } from '../types';
import { ParsedFeedContentContext } from './Feed';
import { useStacks } from '../react-hooks/useStacks';
import { CategoryContext } from './CheckedCategory';


const MarkFeedProcessedButton: FunctionComponent = () => {
  const [inFlight, setInFlight] = useState(false);
  const { persist } = useStacks();
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = {...parsedFeedContentContext};
  const keyForFeed = Object.keys(parsedFeedContent)[0];
  const filenameForFeed = hashStr(`processed_${category}_${shortUrl(keyForFeed)}`);

  const markFeedComplete = (newProcessedPostsForFeed: string[]) => {
    setInFlight(true);
    const processedPostsWithLabel = JSON.parse(
      `{"${filenameForFeed}": ${JSON.stringify(newProcessedPostsForFeed)}}`
    );

    mutate(
      `${filenameForFeed}`,
      persist(`${filenameForFeed}`, processedPostsWithLabel),
      {
        optimisticData: processedPostsWithLabel,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false,
      }
    );

    const anchor =  document.querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  };

  return (
    <>
      {Object.entries(parsedFeedContent).map((feedContentEntry) => {
        const feedLink: string = feedContentEntry[0];
        const feedValue: feedValueType = {...feedContentEntry[1] as feedValueType}
        const currentPosts = feedValue
          .items.map((postItem: cleanPostItemType) => cleanPostItem(postItem))
          .map((postItem) =>
            removePunctuation(`${postItem.title} ${postItem.description}`)
          );

        return (
          <Typography key={feedLink}>
            <IconButton
              title="mark articles completed"
              aria-label="mark articles completed"
              onClick={() => markFeedComplete(currentPosts)}
              disabled={inFlight}
            >
              <RemoveDone />
            </IconButton>
            <Typography variant="caption">{`mark all posts for feed complete`}</Typography>
          </Typography>
        );
      })}
    </>
  );
};

export default MarkFeedProcessedButton;
