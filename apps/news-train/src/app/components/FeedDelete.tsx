import {
  useCallback,
  FunctionComponent,
  Fragment,
} from 'react';
import { IconButton } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { useFeeds } from '../react-hooks/useFeeds';

const FeedDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { feeds, persistFeeds, inFlight } = useFeeds()

  const deleteFeed = useCallback(() => {
    const newFeeds = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(feeds))).filter(
            (feed: [string, unknown]) => feed[0] !== props.text
          )
        ),
      })
    );
    persistFeeds(newFeeds);
  }, [feeds, props.text, persistFeeds]);

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(feeds)))
        .filter((feed: [string, unknown]) => feed[0] === props.text)
        .map((feed: [string, unknown]) => {
          return (
            <Fragment key={`${feed}`}>
              <IconButton disabled={inFlight} aria-label="Delete Feed" onClick={deleteFeed}>
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default FeedDelete;
