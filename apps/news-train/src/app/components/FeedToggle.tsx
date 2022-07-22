import {
  FunctionComponent,
  Fragment,
  useState
} from 'react';
import useSWR, { mutate } from 'swr'
import {
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks'

const FeedToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const [inFlight, setInFlight] = useState(false)
  const {data: feeds} = useSWR('feeds')
  const {persist} = useStacks()

  const persistFeeds = () => {
    const newFeed = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(feeds)))
            .filter((feed: [string, unknown]) => feed[0] === props.text)
            .map((feed: [string, unknown]) => {
              return [
                feed[0],
                {
                  ...Object.fromEntries(
                    Object.entries({
                      ...(feed[1] as Record<string, unknown>),
                    })
                      .filter(
                        (attribute: [string, unknown]) =>
                          attribute[0] === 'checked'
                      )
                      .map((attribute : [string, unknown]) => [attribute[0], !attribute[1]])
                  ),
                  ...Object.fromEntries(
                    Object.entries({
                      ...(feed[1] as Record<string, unknown>),
                    }).filter((attribute : [string, unknown]) => attribute[0] !== 'checked')
                  ),
                },
              ];
            })
        ),
      })
    );
    const newFeeds = { ...feeds, ...newFeed }
    mutate('feeds', persist('feeds', newFeeds), {optimisticData: newFeeds})
  }

  return (
    <Fragment>
      {Object.entries(feeds as object)
        .filter((feed : [string, unknown]) => feed[0] === props.text)
        .map((feed : [string, unknown]) => {
          const attributes = feed[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              disabled={inFlight}
              key={feed[0]}
              control={
                <Switch
                  size='medium'
                  checked={Object.values(
                    Object.fromEntries(
                      [Object.entries({...attributes})].flat().filter(
                        (attribute : [string, unknown]) => attribute[0] === 'checked'
                      )
                    )
                  ).some(checked => checked)}
                  onChange={() => persistFeeds()}
                  name={props.text}
                />
              }
              label={<Typography>{props.text}</Typography>}
            />
          );
        })}
    </Fragment>
  );
};

export default FeedToggle;
