import {FunctionComponent, Fragment } from 'react';
import useSWR, { mutate } from 'swr'
import { Chip } from '@mui/material';
import {useStacks} from '../react-hooks/useStacks'

const FeedCategories: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { data: feeds } = useSWR('feeds')
  const { data: categories } = useSWR('categories');
  const { persist } = useStacks()

  const appendOrRemoveChip = (category: string) => {
    const newFeeds = {
      ...{...feeds},
      ...Object.fromEntries(
        Object.entries({...feeds})
          .filter((feed: [string, unknown]) => feed[0] !== props.text)
          .concat(
            Object.entries({...feeds})
              .filter((feed: [string, unknown]) => feed[0] === props.text)
              .map((feed: [string, unknown]) => {
                return [
                  feed[0],
                  {
                    ...JSON.parse(JSON.stringify(feed[1])),
                    categories: [
                      ...Object.entries({...feeds})
                        .filter((feed: [string, unknown]) => feed[0] === props.text)
                        .map((feed: [string, unknown]) => {
                          const attributes = feed[1] as Record<string, unknown>;
                          const feedCategories: string[] = attributes['categories'] as string[];
                          return feedCategories;
                        })
                        .flat()
                        .filter((removeCategory: string) => removeCategory !== category),
                      ...[
                        Object.entries({...feeds})
                          .filter((feed: [string, unknown]) => feed[0] === props.text)
                          .map((feed: [string, unknown]) => {
                            const attributes = feed[1] as Record<
                              string,
                              unknown
                            >;
                            const feedCategories: string[] = attributes['categories'] as string[];
                            return feedCategories;
                          })
                          .flat()
                          .concat(category)
                          .every((e: string, i: number, a: string[]) => a.indexOf(e) === i),
                      ]
                        .filter(addCategory => addCategory)
                        .map(() => category),
                    ],
                  },
                ];
              })
          )
      ),
    }
    mutate('feeds', persist('feeds', newFeeds), {optimisticData: newFeeds})
  };

  return (
    <Fragment>
      {Object.entries({...feeds})
        .filter((feed: [string, unknown]) => feed[0] === props.text)
        .map((feed: [string, unknown]) => {
          const attributes = feed[1] as Record<string, unknown>;
          const feedCategories: string[] = attributes['categories'] as string[];
          return (
            <Fragment key={feed[0]}>
              {Object.entries({...categories}).map((category: [string, unknown]) => {
                return [
                  feedCategories
                    .filter((feedCategory: string) => {
                      return feedCategory === category[0];
                    })
                    .map(() => (
                      <Chip
                        key={category[0]}
                        label={category[0]}
                        color={'primary'}
                        onClick={() => appendOrRemoveChip(category[0])}
                      />
                    )),
                  <Chip
                    key={category[0]}
                    label={category[0]}
                    color={'default'}
                    onClick={() => appendOrRemoveChip(category[0])}
                  />,
                ]
                  .flat()
                  .find(() => true);
              })}
            </Fragment>
          );
        })}
    </Fragment>
  );
};
export default FeedCategories;
