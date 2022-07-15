import { useCallback, FunctionComponent, Fragment } from 'react';
import { Chip } from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds';
import { useCategories } from '../react-hooks/useCategories';

const FeedCategories: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { feeds, persistFeeds } = useFeeds();
  const { categories } = useCategories();

  const persistFeedsCallback = useCallback(
    (newFeeds: object) => {
      persistFeeds(newFeeds);
    },
    [persistFeeds]
  );

  const appendOrRemoveChip = (category: string) => {
    persistFeedsCallback({
      ...JSON.parse(JSON.stringify(feeds)),
      ...Object.fromEntries(
        Object.entries(JSON.parse(JSON.stringify(feeds)))
          .filter((feed: [string, unknown]) => feed[0] !== props.text)
          .concat(
            Object.entries(JSON.parse(JSON.stringify(feeds)))
              .filter((feed: [string, unknown]) => feed[0] === props.text)
              .map((feed: [string, unknown]) => {
                return [
                  feed[0],
                  {
                    ...JSON.parse(JSON.stringify(feed[1])),
                    categories: [
                      ...Object.entries(JSON.parse(JSON.stringify(feeds)))
                        .filter((feed: [string, unknown]) => feed[0] === props.text)
                        .map((feed: [string, unknown]) => {
                          const attributes = feed[1] as Record<string, unknown>;
                          const feedCategories: string[] = JSON.parse(
                            JSON.stringify(attributes['categories'])
                          );
                          return feedCategories;
                        })
                        .flat()
                        .filter((removeCategory: string) => removeCategory !== category),
                      ...[
                        Object.entries(JSON.parse(JSON.stringify(feeds)))
                          .filter((feed: [string, unknown]) => feed[0] === props.text)
                          .map((feed: [string, unknown]) => {
                            const attributes = feed[1] as Record<
                              string,
                              unknown
                            >;
                            const feedCategories: string[] = JSON.parse(
                              JSON.stringify(attributes['categories'])
                            );
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
    });
  };

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(feeds)))
        .filter((feed: [string, unknown]) => feed[0] === props.text)
        .map((feed: [string, unknown]) => {
          const attributes = feed[1] as Record<string, unknown>;
          const feedCategories: string[] = JSON.parse(
            JSON.stringify(attributes['categories'])
          );
          return (
            <Fragment key={feed[0]}>
              {Object.entries(JSON.parse(JSON.stringify(categories))).map((category: [string, unknown]) => {
                return [
                  feedCategories
                    .filter(feedCategory => {
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
