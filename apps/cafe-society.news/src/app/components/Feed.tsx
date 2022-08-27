import {
  FunctionComponent,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import useSWR from 'swr';
import { Grid } from '@mui/material';
import localforage from 'localforage';
import { cleanTags } from '../utils';
import xml2js from 'xml2js';
import axios from 'axios';

import { useStacks } from '../react-hooks/useStacks';
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json';
import defaultFeeds from '../react-hooks/defaultFeeds.json';

import { CategoryContext } from './CheckedCategory';

// import VisibilitySensor from 'react-visibility-sensor';

export const ParsedFeedContentContext = createContext({});

type Props = { children: ReactNode };
const Feed: FunctionComponent<Props> = ({ children }: Props) => {
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;

  useEffect(() => {
    // reload Mainpage?
  }, [category]);

  const { fetchFileLocal } = useStacks();
  const { data: feedsdata } = useSWR('feeds', fetchFileLocal('feeds', {}), {
    fallbackData: defaultFeeds,
  });
  const feeds = { ...(feedsdata as object) };

  const { data: corsProxiesdata } = useSWR(
    'corsProxies',
    () => localforage.getItem('corsProxies'),
    { fallbackData: defaultCorsProxies }
  );
  const corsProxies = { ...(corsProxiesdata as object) };

  const checkedFeedsForCategory = Object.entries(feeds as object)
    .filter((feedEntry) => {
      return Object.entries(feedEntry[1] as object)
        .filter((feedEntryAttribute) => {
          return feedEntryAttribute[0] === 'categories';
        })
        .find((feedEntryAttribute) => {
          return [feedEntryAttribute[1]].flat().indexOf(category) !== -1;
        });
    })
    .filter((feedEntry) => {
      return Object.entries(feedEntry[1] as object)
        .filter((feedEntryAttribute) => {
          return feedEntryAttribute[0] === 'checked';
        })
        .filter((feedEntryAttribute) => {
          return feedEntryAttribute[1] === true;
        })
        .find(() => true);
    });

  const checkedCorsProxies = Object.entries({ ...corsProxies })
    .filter(
      (corsProxyEntry) =>
        Object.assign(corsProxyEntry[1] as object).checked === true
    )
    .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])
    .filter((noblanks) => !!noblanks);

  const fetchFeedContent = (
    feedUrl: string,
    corsProxies: string[]
  ): Promise<object> => {
    return new Promise((resolve, reject) => {
      const [corsProxy, ...rest] = corsProxies;
      [corsProxy]
        .flat()
        .filter((corsProxyItem) => {
          return !!corsProxyItem;
        })
        .forEach((corsProxyItem) => {
          axios
            .get(`${corsProxyItem}${feedUrl}`)
            .then((response) => {
              resolve(response);
              return;
            })
            .catch(() => {
              if (rest.length === 0) {
                reject();
              }
              fetchFeedContent(feedUrl, rest);
            });
        });
    });
  };
  const fetchFeedContentMulti = (
    feeds: object[],
    corsProxies: string[]
  ): Promise<object> => {
    return new Promise((resolve, reject) => {
      const feedQueue: object[] = [];
      feeds.forEach((feed) => {
        const feedLabel =
          Object.entries(Object.values(feed)[1])
            .filter((feedEntryAttribute) => {
              return feedEntryAttribute[0] === 'label';
            })
            .map((feedEntryAttribute) => {
              return `${feedEntryAttribute[1]}`;
            })
            .find(() => true) || '';

        feedQueue.push(
          new Promise((resolve, reject) => {
            const feedKey = feed.toString().split(',')[0];
            fetchFeedContent(feedKey, corsProxies)
              .then((fetchedContent: object) => {
                return [fetchedContent].flat().forEach((fetchedContentItem) => {
                  resolve([
                    feedKey,
                    { feedLabel: `${feedLabel}`, ...fetchedContent },
                  ]);
                });
              })
              .catch((error) => {
                resolve({});
              });
          })
        );
      });
      Promise.all(feedQueue)
        .then((fetchedContent) => {
          resolve(Object.fromEntries(Object.assign(fetchedContent as object)));
        })
        .catch(() => resolve({}));
    });
  };

  const parseFeedContentMulti = (fetchedContent: object) => {
    return new Promise((resolve, reject) => {
      const parseFeedQueue: object[] = [];
      [Object.entries(fetchedContent)]
        .flat()
        .filter((fetchedContentEntry) => fetchedContentEntry[1] !== undefined)
        .forEach((fetchedContentEntry: [string, object]) => {
          parseFeedQueue.push(
            new Promise((resolve, reject) => {
              const parser = new xml2js.Parser();
              parser.parseString(
                Object.assign({ ...fetchedContentEntry[1] } as object).data,
                function (
                  error: Error | null,
                  result: {
                    rss?: {
                      channel?: {
                        item: object[];
                        title?: string;
                        description?: string;
                      }[];
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    feed?: { entry?: object; title: any };
                  }
                ) {
                  if (error) {
                    return;
                  }
                  const feedTitle = `${
                    result?.feed?.title[0][`_`].toString() ||
                    result?.feed?.title[0]
                  }`;
                  const channelObj = [result?.rss?.channel]
                    .flat()
                    .find(() => true);

                  const channelTitle = channelObj?.title?.toString();
                  const channelDescription = channelObj?.description;
                  const channelContentItem = [result?.rss?.channel]
                    .flat()
                    .filter((channel) => !!channel?.item)
                    .map((channel) => {
                      return channel?.item
                        .filter((item: object) => item !== {})
                        .map(
                          (item: {
                            title?: string;
                            link?: string;
                            description?: string;
                          }) => {
                            return {
                              title: cleanTags(
                                `${[item.title].flat().find(() => true)}`
                              ),
                              link: [item.link].flat().find(() => true),
                              description: cleanTags(
                                `${[item.description].flat().find(() => true)}`
                              ),
                            };
                          }
                        );
                    });

                  // atom feeds have entry instead of item

                  const channelContentEntry = [result?.feed]
                    .flat()
                    .filter((feed) => !!feed?.entry)
                    .map((feed) =>
                      [feed?.entry].flat().map((feedEntry?: object) => {
                        const rawLink: unknown = [
                          Object.entries(feedEntry as object).find(
                            (attribute: [string, unknown]) =>
                              attribute[0] === 'link'
                          ),
                        ]
                          .flat()
                          .slice(-1)
                          .find(() => true);
                        const linkVal: unknown = [
                          Object.values(rawLink as object),
                        ]
                          .flat()
                          .find(() => true);
                        const linkObj: unknown = [
                          Object.values(linkVal as object),
                        ]
                          .flat()
                          .find(() => true);
                        const hrefEntry: unknown[] = Object.entries(
                          linkObj as object
                        ).filter(
                          (attribute: [string, unknown]) =>
                            attribute[0] === 'href'
                        );
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hrefVal: unknown = Object.values(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          Object.fromEntries(hrefEntry as [PropertyKey, any])
                        ).find(() => true);
                        const rawTitle: unknown = [
                          Object.entries(feedEntry as object).find(
                            (attribute: [string, unknown]) =>
                              attribute[0] === 'title'
                          ),
                        ]
                          .flat()
                          .slice(-1)
                          .find(() => true);
                        const titleVal: unknown = [
                          Object.values(rawTitle as object),
                        ]
                          .flat()
                          .find(() => true);
                        const titleStr: unknown = [
                          Object.values(titleVal as object),
                        ]
                          .flat()
                          .find(() => true);
                        const rawDescription: unknown = [
                          Object.entries(feedEntry as object).find(
                            (attribute: [string, unknown]) =>
                              attribute[0] === 'summary'
                          ),
                        ]
                          .flat()
                          .slice(-1)
                          .find(() => true);
                        const descriptionVal: unknown = [
                          Object.values({ ...(rawDescription as object) }),
                        ]
                          .flat()
                          .find(() => true);
                        const descriptionStr: unknown = [
                          [Object.values(descriptionVal as object)]
                            .flat()
                            .find(() => true),
                        ]
                          .slice(-1)
                          .find(() => true);

                        return {
                          title: `${titleStr}`,
                          link: `${hrefVal}`,
                          description: `${descriptionStr}`,
                        };
                      })
                    );

                  const feedItemEntry = [
                    fetchedContentEntry[0],
                    {
                      title: `${feedTitle}${channelTitle}`.replace(
                        /undefined/g,
                        ''
                      ),
                      description: `${channelDescription}`.replace(
                        /undefined/g,
                        ''
                      ),
                      items: [
                        ...channelContentItem,
                        ...channelContentEntry,
                      ].flat(Infinity),
                    },
                  ];
                  resolve(feedItemEntry);
                }
              );
            })
          );
        });
      Promise.all(parseFeedQueue).then((parsedContent: object) => {
        resolve(Object.fromEntries(parsedContent as [string, object][]));
      });
    });
  };

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
        .then((fetchedContent) => parseFeedContentMulti(fetchedContent))
        .then((parsedContent) => resolve(parsedContent))
        .catch((error) => reject(error));
    });
  };

  const { data: parsedContentdata } = useSWR(
    `fetchedContent-${category}`,
    fetcher,
    {
      suspense: true,
      revalidateOnFocus: true,
      focusThrottleInterval: 60000
    }
  );

  const parsedContent: unknown = { ...(parsedContentdata as object) };

  return (
    <Grid>
      {Object.entries(parsedContent as object)
        .filter((parsedFeedContent) => {
          return !!parsedFeedContent[1];
        })
        .map((parsedFeedContent: [string, object]) => {
          const parsedFeedContentObj = Object.fromEntries([parsedFeedContent]);
          throw new Error('cowboys cannot swim')
          return (
            <ParsedFeedContentContext.Provider
              key={JSON.stringify(parsedFeedContentObj)}
              value={parsedFeedContentObj}
            >
              {children}
            </ParsedFeedContentContext.Provider>
          );
        })}
    </Grid>
  );
};

export default Feed;
