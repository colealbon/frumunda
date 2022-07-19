import React, { FunctionComponent, createContext, useContext, ReactNode } from 'react';
import useSWR  from 'swr';
import {
  Grid
} from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds'
import { CorsProxiesContext } from './CorsProxies'
import { CategoryContext } from './Category';
import { cleanTags } from '../utils'
import xml2js from 'xml2js';
import axios from 'axios';

// import VisibilitySensor from 'react-visibility-sensor';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { parse } = require('rss-to-json');

export const ParsedFeedContentContext = createContext({});

type Props = {children: ReactNode}
const Feed: FunctionComponent<Props> = ({children}: Props) => {

  const { feeds } = useFeeds()
  const categoryContext = useContext(CategoryContext)
  const category = `${categoryContext}`

  const corsProxiesContext = useContext(CorsProxiesContext)
  const corsProxies = Object.assign(corsProxiesContext)
  
  const checkedFeedsForCategory = Object.entries(feeds as object)
    .filter(feedEntry => {
      if (category === 'allCategories') {
        return true
      }
      return Object.entries(feedEntry[1] as object)
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[0] === 'categories';
        })
        .find(feedEntryAttribute => {
          return [feedEntryAttribute[1]].flat().indexOf(category) !== -1;
        });
    })
    .filter((feedEntry) => {
      return Object.entries(feedEntry[1] as object)
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[0] === 'checked';
        })
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[1] === true;
        })
        .find(() => true);
    })

  const checkedCorsProxies = Object.entries(corsProxies)
  .filter(corsProxyEntry => Object.assign(corsProxyEntry[1] as object).checked === true)
  .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])
  .filter(noblanks => !!noblanks);

  const fetchFeedContent = (feedUrl: string, corsProxies: string[]): Promise<object> => {
    return new Promise((resolve, reject) => {
      const [corsProxy, ...rest] = corsProxies;
      [corsProxy]
        .flat()
        .filter(corsProxyItem => {
          return !!corsProxyItem;
        })
        .forEach(corsProxyItem => {
          axios
            .get(`${corsProxyItem}${feedUrl}`)
            .then(response => {
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
  const fetchFeedContentMulti = (feeds: object[], corsProxies: string[]): Promise<object> => {
    return new Promise((resolve, reject) => {
      const feedQueue: object[] = [];
      feeds.forEach(feed => {

        const feedLabel = Object.entries(Object.values(feed)[1])
          .filter(feedEntryAttribute => {
            return feedEntryAttribute[0] === 'label';
          })
          .map(feedEntryAttribute => {
            return `${feedEntryAttribute[1]}`
          })
          .find(() => true) || ''
        
        feedQueue.push(
          new Promise((resolve, reject) => {
            const feedKey = feed.toString().split(',')[0]
            fetchFeedContent(feedKey, corsProxies)
              .then((fetchedContent: object) => {
                return [fetchedContent].flat().forEach(fetchedContentItem => {
                  resolve([feedKey, {feedLabel: `${feedLabel}`, ...fetchedContent}]);
                });
              })
              .catch((error) => {
                resolve({})
              });
          })
        )
      });
      Promise.all(feedQueue).then(fetchedContent => {
        resolve(Object.fromEntries(Object.assign(fetchedContent as object)));
      })
      .catch(() => resolve({}))
    });
  };

  const parseFeedContentMulti = (fetchedContent: object) => {
    return new Promise((resolve, reject) => {
      const parseFeedQueue: object[] = [];
      [Object.entries(fetchedContent)]
        .flat()
        .filter(fetchedContentEntry => fetchedContentEntry[1] !== undefined)
        .forEach((fetchedContentEntry: [string, object]) => {

          parseFeedQueue.push(
            new Promise((resolve, reject) => {
              const parser = new xml2js.Parser();
              parser.parseString(
                
                Object.assign({ ...fetchedContentEntry[1] } as object).data,
                function (
                  error: Error | null, 
                  result: {rss?: {channel?: {item: object[], title?: string, description?: string}[]}, feed?: {entry?: object, title: string[] }}) {
                  if (error) {
                    return;
                  }
                  const feedTitle = `${result?.feed?.title[0]}`
                  const channelObj = [result.rss?.channel]
                  .flat()
                  .find(() => true)

                  const channelTitle = `${channelObj?.title}`
                  const channelDescription = `${channelObj?.description}`
                  const channelContentItem = [result.rss?.channel]
                    .flat()
                    .filter(channel => !!channel?.item)
                    .map(channel => {
                      return channel?.item
                      .filter((item: object) => item !== {})
                      .map((item: {title?: string , link?: string , description?: string }) => {
                        return {
                          title: cleanTags(`${[item.title].flat().find(() => true)}`),
                          link: [item.link].flat().find(() => true),
                          description: cleanTags(`${[item.description].flat().find(() => true)}`),
                        }
                      })
                    })
  
                  // atom feeds have entry instead of item

                  const channelContentEntry = [result.feed]
                  .flat()
                  .filter(feed => !!feed?.entry)
                  .map(feed => [feed?.entry].flat().map((feedEntry?: object) => {
                      const rawLink: object = [Object.entries(feedEntry as object).find((attribute: [string, unknown]) => attribute[0] === 'link')].flat().slice(-1).find(() => true)
                      const linkVal: object = [Object.values(rawLink)].flat().find(() => true)
                      const linkObj: object = [Object.values(linkVal)].flat().find(() => true)
                      const hrefEntry: [string, object][] =  Object.entries(linkObj).filter((attribute: [string, unknown]) => attribute[0] === 'href')
                      const hrefVal: unknown = Object.values(Object.fromEntries(hrefEntry)).find(() => true)
                      const rawTitle : object = [Object.entries(feedEntry as object).find((attribute: [string, unknown]) => attribute[0] === 'title')].flat().slice(-1).find(() => true)
                      const rawDescription: object = [Object.entries(feedEntry as object).find((attribute: [string, unknown]) => attribute[0] === 'summary')].flat().slice(-1).find(() => true)
                      return {
                        title: cleanTags(`${rawTitle}`),
                        link: `${hrefVal}`,
                        description: cleanTags(`${rawDescription}`),
                      }
                    })
                  )

                  const feedItemEntry = [
                    fetchedContentEntry[0],
                    {
                      title: `${feedTitle}${channelTitle}`.replace(/undefined/g, ''),
                      description: `${channelDescription}`.replace(/undefined/g, ''),
                      items: [...channelContentItem,
                      ...channelContentEntry].flat(Infinity)
                    }
                  ]
                  resolve(feedItemEntry);
                }
              );
            })
          );
        });
      Promise.all(parseFeedQueue).then((parsedContent: object) => {
        resolve(Object.fromEntries(parsedContent as [string, object][]))
      });
    });
  };

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
      .then(fetchedContent => parseFeedContentMulti(fetchedContent))
      .then(parsedContent => resolve(parsedContent))
      .catch(error => reject(error))
    })
  }

  const { data } = useSWR(
    `fetchedContent-${category}`,
    fetcher, 
    {
      suspense: true
      ,dedupingInterval: 10 * 1000
    }
  )
  
  const parsedContent: unknown = Object.assign(data as object)

  return (
    <Grid>
      {
        Object.entries(parsedContent as object)
        .filter((parsedFeedContent) => {
          return !!parsedFeedContent[1]
        })
        .map((parsedFeedContent: [string, object]) => {
          const parsedFeedContentObj = Object.fromEntries([parsedFeedContent])         
          return (
            <ParsedFeedContentContext.Provider key={JSON.stringify(parsedFeedContentObj)} value={parsedFeedContentObj}>
                {children}
            </ParsedFeedContentContext.Provider>
          )
        })
      }
    </Grid>
  )
};

export default Feed;