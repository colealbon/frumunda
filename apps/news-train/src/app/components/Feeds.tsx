import React, { FunctionComponent, createContext, useContext, ReactNode } from 'react';
import useSWR  from 'swr';
import { Grid, Paper } from '@mui/material';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'
import { CorsProxiesContext } from './CorsProxiesLoad'
import VisibilitySensor from 'react-visibility-sensor';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('rss-to-json');

export const ParsedFeedContentContext = createContext({});

type Props = {children: ReactNode}
const Feeds: FunctionComponent<Props> = ({children}: Props) => {

  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { feeds } = useFeeds()

  const corsProxiesContext = useContext(CorsProxiesContext)
  const corsProxies = Object.assign(corsProxiesContext)
  
  const checkedFeedsForCategory = Object.entries(feeds)
    .filter(feedEntry => {
      if (`${selectedCategoryIndex}` === 'allCategories') {
        return feedEntry
      }
      return Object.entries(feedEntry[1] as object)
        .filter(feedEntryAttribute => {
          return feedEntryAttribute[0] === 'categories';
        })
        .find(feedEntryAttribute => {
          return [feedEntryAttribute[1]].flat().indexOf(`${selectedCategoryIndex}`) !== -1;
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
    .map((feedEntry) => feedEntry[0])

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
            console.log('badurl')
            console.log(`${corsProxyItem}${feedUrl}`)
            if (rest.length === 0) {
              reject();
            }
            fetchFeedContent(feedUrl, rest);
          });
        });
    });
  };
  const fetchFeedContentMulti = (feeds: string[], corsProxies: string[]): Promise<object> => {
    return new Promise((resolve, reject) => {
      const feedQueue: object[] = [];
      Object.values(feeds).map(feed =>
        feedQueue.push(
          new Promise((resolve, reject) => {
            fetchFeedContent(feed, corsProxies)
              .then((fetchedContent: object) => {
                return [fetchedContent].flat().forEach(fetchedContentItem => {
                  resolve([feed, fetchedContent]);
                });
              })
              .catch((error) => {
                resolve({})
              });
          })
        )
      );
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
    `fetchedContent-${selectedCategoryIndex}`,
    fetcher, 
    {
      suspense: true
    }
  )
  
  const fetchedContent: unknown = Object.assign(data as object)

  return (
    <Paper 
      elevation={3} 
      style={{ 
        width: "95%",
        minHeight: "95vh"
      }}
    >
      <Grid>
        {
          Object.values(fetchedContent as object)
          .filter((noEmpties: unknown) => !!noEmpties)
          .map((parsedFeedContent: unknown) => {
            const feedTitleText = Object.entries(Object.assign({...parsedFeedContent as object} || {title: ''}).title)
            .filter(titleEntry => {
              return titleEntry[0] === "$text"
            })
            .map(titleEntry => titleEntry[1])
            .concat(Object.assign({...parsedFeedContent as object}).title)
            .find(() => true)
            return (
              <ParsedFeedContentContext.Provider value={parsedFeedContent as object}>
                <div
                  style={{ 
                    width: "80%"
                  }}
                >
                  <div
                    style={{ 
                      width: "70%"
                    }}
                  >
                    {`${feedTitleText}`}
                  </div>
                {children}
               </div>
              </ParsedFeedContentContext.Provider>
            )
          })
        }
      </Grid>
    </Paper>
  )
};

export default Feeds;

// {[0, 1, 2].map((item) => (
//   <ListItem key={`item-${sectionId}-${item}`}>
//     <ListItemText primary={} />
//   </ListItem>
// ))}
