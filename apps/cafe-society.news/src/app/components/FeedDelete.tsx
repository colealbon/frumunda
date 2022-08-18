import { FunctionComponent, Fragment, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useStacks } from '../react-hooks/useStacks';

import { IconButton } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const FeedDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const [inFlight, setInFlight] = useState(false);
  const { data: feeds } = useSWR('feeds');
  const { persistLocal } = useStacks();

  const deleteFeed = () => {
    const newFeeds = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries({ ...feeds }).filter(
            (feed: [string, unknown]) => feed[0] !== props.text
          )
        ),
      })
    );
    setInFlight(true)
    mutate('feeds', persistLocal('feeds', newFeeds), { optimisticData: feeds })
    .then(() => setInFlight(false))
  };

  return (
    <Fragment>
      {Object.entries({ ...feeds })
        .filter((feed: [string, unknown]) => feed[0] === props.text)
        .map((feed: [string, unknown]) => {
          return (
            <Fragment key={`${feed}`}>
              <IconButton
                disabled={inFlight}
                aria-label="Delete Feed"
                onClick={() => deleteFeed()}
              >
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default FeedDelete;
