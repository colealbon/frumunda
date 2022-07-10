import React, { FunctionComponent, createContext, useContext, ReactNode } from 'react';
import useSWR  from 'swr';
import {
  Grid,
  Box, 
} from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds'
import { CorsProxiesContext } from './CorsProxies'
import { CategoryContext } from './Category';
import { htmlToText } from 'html-to-text';
import MarkFeedProcessedButton from './MarkFeedProcessedButton'

// import VisibilitySensor from 'react-visibility-sensor';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('rss-to-json');

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
    //.map((feedEntry) => feedEntry[0])

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
          parse(`${corsProxyItem}${feedUrl}`)
          .then((response: object) => {
            if (!response) {
              throw(new Error('fetchparse failed'))
            }
            resolve(response);
            return;
          })
          .catch(() => {
            console.log(`badurl ${corsProxyItem}${feedUrl}`)
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
  const fetcher = () => {
    return new Promise((resolve, reject) => {
      fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
      .then(parsedContent => {
        resolve(parsedContent)
      })
      .catch(error => reject(error))
    })
  }

  const { data } = useSWR(
    `fetchedContent-${category}`,
    fetcher, 
    {
      suspense: true
      ,dedupingInterval: 10 * 1000, 
      // shouldRetryOnError: false,
      // revalidateOnFocus: false
    }
  )
  
  const fetchedContent: unknown = Object.assign(data as object)
  return (
    <Box 
      style={{ 
        width: "95%",
        minHeight: "95vh"
      }}
    >
      <Grid>
        {
          Object.entries(fetchedContent as object)
          .filter((parsedFeedContent) => !!parsedFeedContent[1])
          .map((parsedFeedContent: [string, unknown]) => {
            const feedTitleText = `${Object.assign({...parsedFeedContent[1] as object}).feedLabel} `.concat(`${Object.entries(Object.assign({...parsedFeedContent[1] as object} || {title: ''}).title)
            .filter(titleEntry => {
              return titleEntry[0] === "$text"
            })
            .map(titleEntry => htmlToText(
                `${titleEntry[1]}`,
                {
                  ignoreHref:
                    true,
                  ignoreImage:
                    true,
                }
              )
              .replace(
                '&mdash;',
                ''
              ))

            .concat(Object.assign({...parsedFeedContent[1] as object}).title)
            .find(() => true)}`)

            const parsedFeedContentObj = Object.fromEntries([parsedFeedContent])
            return (
              <ParsedFeedContentContext.Provider key={`${feedTitleText}`} value={parsedFeedContentObj as object}>
                  {children}
              </ParsedFeedContentContext.Provider>
            )
          })
        }
      </Grid>
    </Box>
  )
};

export default Feed;

// {[0, 1, 2].map((item) => (
//   <ListItem key={`item-${sectionId}-${item}`}>
//     <ListItemText primary={} />
//   </ListItem>
// ))}
