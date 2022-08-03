import { FunctionComponent, Fragment } from 'react';
import useSWR, { mutate } from 'swr';
import { Chip } from '@mui/material';
import { useStacks } from '../react-hooks/useStacks';
import defaultCategories from '../react-hooks/defaultCategories.json';
import defaultFeeds from '../react-hooks/defaultFeeds.json';

const FeedCategories: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { fetchFileLocal, persistLocal } = useStacks();
  const { data: feedsdata } = useSWR(
    'feeds',
    fetchFileLocal('feeds', defaultFeeds),
    { fallbackData: defaultFeeds }
  );
  const feeds = { ...(feedsdata as object) };
  const { data: categoriesdata } = useSWR(
    'categories',
    fetchFileLocal('categories', defaultCategories),
    { fallbackData: defaultCategories }
  );

  const categories = { ...(categoriesdata as object) };

  const appendOrRemoveChip = (category: string) => {
    const newFeeds = {
      ...{ ...feeds },
      ...Object.fromEntries(
        Object.entries({ ...feeds })
          .filter((feed: [string, unknown]) => feed[0] !== props.text)
          .concat(
            Object.entries({ ...feeds })
              .filter((feed: [string, unknown]) => feed[0] === props.text)
              .map((feed: [string, unknown]) => {
                return [
                  feed[0],
                  {
                    ...(feed[1] as object),
                    categories: [
                      ...Object.entries({ ...feeds })
                        .filter(
                          (feed: [string, unknown]) => feed[0] === props.text
                        )
                        .map((feed: [string, unknown]) => {
                          const attributes = feed[1] as Record<string, unknown>;
                          const feedCategories: string[] = [
                            { ...attributes }['categories'],
                          ].flat() as string[];
                          return feedCategories;
                        })
                        .flat()
                        .filter(
                          (removeCategory: string) =>
                            removeCategory !== category
                        ),
                      ...[
                        Object.entries({ ...feeds })
                          .filter(
                            (feed: [string, unknown]) => feed[0] === props.text
                          )
                          .map((feed: [string, unknown]) => {
                            const attributes = feed[1] as Record<
                              string,
                              unknown
                            >;
                            const feedCategories: string[] = [
                              { ...attributes }['categories'],
                            ].flat() as string[];
                            return feedCategories;
                          })
                          .flat()
                          .concat(category)
                          .every(
                            (e: string, i: number, a: string[]) =>
                              a.indexOf(e) === i
                          ),
                      ]
                        .filter((addCategory) => addCategory)
                        .map(() => category),
                    ],
                  },
                ];
              })
          )
      ),
    };
    mutate('feeds', persistLocal('feeds', newFeeds), {
      optimisticData: newFeeds,
    });
  };

  return (
    <Fragment>
      {Object.entries({ ...feeds })
        .filter((feed: [string, unknown]) => feed[0] === props.text)
        .map((feed: [string, unknown]) => {
          const attributes = feed[1] as Record<string, unknown>;
          const feedCategories: string[] = [
            { ...attributes }['categories'],
          ].flat() as string[];
          return (
            <Fragment key={feed[0]}>
              {Object.entries({ ...categories }).map(
                (category: [string, unknown]) => {
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
                }
              )}
            </Fragment>
          );
        })}
    </Fragment>
  );
};
export default FeedCategories;
