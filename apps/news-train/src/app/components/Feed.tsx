import React, { FunctionComponent, createContext, useContext, ReactNode } from 'react';
import useSWR  from 'swr';
import { Grid, Paper, Link, Tooltip} from '@mui/material';
import { useFeeds } from '../react-hooks/useFeeds'
import { CorsProxiesContext } from './CorsProxiesLoad'
import { CategoryContext } from './Category';
// import VisibilitySensor from 'react-visibility-sensor';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('rss-to-json');

export const ParsedFeedContentContext = createContext({});
// export const FeedContext = createContext('');

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
        return feedEntry
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
      //,
      // dedupingInterval: 60 * 1000, 
      // shouldRetryOnError: false,
      // revalidateOnFocus: false
    }
  )
  
  const fetchedContent: unknown = Object.assign(data as object)

  return (
    <Paper 
      elevation={0} 
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

            const feedTitleText = `${Object.assign({...parsedFeedContent as object}).feedLabel} `.concat(`${Object.entries(Object.assign({...parsedFeedContent as object} || {title: ''}).title)
              .filter(titleEntry => {
                return titleEntry[0] === "$text"
              })
              .map(titleEntry => titleEntry[1])
              .concat(Object.assign({...parsedFeedContent as object}).title)
              .find(() => true)}`)

            const feedLink = Object.entries(Object.assign({...parsedFeedContent as object} || {link: ''}).link)
              .filter(linkEntry => {
                return linkEntry[0] === "$text"
              })
              .map(linkEntry => linkEntry[1])
              .concat(Object.assign({...parsedFeedContent as object}).link)
              .find(() => true)
          
              const feedDescription = Object.entries(Object.assign({...parsedFeedContent as object} || {link: ''}).description)
              .filter(descriptionEntry => {
                return descriptionEntry[0] === "$text"
              })
              .map(descriptionEntry => descriptionEntry[1])
              .concat(Object.assign({...parsedFeedContent as object}).description)
              .find(() => true)

            return (
              <ParsedFeedContentContext.Provider key={`${feedTitleText}`} value={parsedFeedContent as object}>
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
                    <Tooltip title={`${feedDescription}`}>
                      <Link href={`${feedLink}`}>{`${feedTitleText}`}</Link>
                    </Tooltip>
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

export default Feed;

// {[0, 1, 2].map((item) => (
//   <ListItem key={`item-${sectionId}-${item}`}>
//     <ListItemText primary={} />
//   </ListItem>
// ))}
