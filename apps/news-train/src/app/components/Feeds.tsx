import React, { FunctionComponent, useContext, createContext } from 'react';
import useSWR  from 'swr';
import { Grid, Paper, Typography } from '@mui/material';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'
// import { useCorsProxies } from '../react-hooks/useCorsProxies'
import { CorsProxiesContext } from './CorsProxiesLoad';
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'
import Posts from './Posts'

// // eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse } = require('rss-to-json');

export const ParsedFeedContentContext = createContext({});
const Feeds: FunctionComponent = () => {

  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { feeds } = useFeeds()

  const corsProxiesContext = useContext(CorsProxiesContext);
  const corsProxies = {...corsProxiesContext}

  //   const { selectedPageIndex } = useSelectedPageIndex();

  const fetcher = () => {
    return new Promise((resolve, reject) => {
      const checkedCorsProxies = Object.entries(corsProxies)
        .filter(corsProxyEntry => Object.assign(corsProxyEntry[1] as object).checked === true)
        .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])

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
      const fetchFeedContent = (feedUrl: string, corsProxies: string[]): Promise<object> => {
        console.log(feedUrl)
        console.log(corsProxies)
        return new Promise((resolve, reject) => {
          const [corsProxy, ...rest] = corsProxies;
          [corsProxy]
            .flat()
            .filter(corsProxyItem => {
              return !!corsProxyItem;
            })
            .forEach(corsProxyItem => {
              console.log(`${corsProxyItem}${feedUrl}`)
              parse(`${corsProxyItem}${feedUrl}`)
                .then((response: object) => {
                  console.log(response)
                  resolve(response);
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
      const fetchFeedContentMulti = (feeds: string[], corsProxies: string[]): Promise<object> => {
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve({
        //       corsProxies: corsProxies,
        //       feeds: feeds
        //     })
        //   }, 2000)
        // })
        return new Promise((resolve, reject) => {
          const feedQueue: object[] = [];
          Object.values(feeds).forEach(feed =>
            feedQueue.push(
              new Promise((resolve, reject) => {
                fetchFeedContent(feed, corsProxies)
                  .then((fetchedContent) => {
                    console.log(fetchedContent)
                    resolve(fetchedContent)
                    // [fetchedContent].flat().forEach(fetchedContentItem => {
                    //   resolve([feed, fetchedContentItem]);
                    // });
                  })
                  .catch((error) => {
                    resolve({})
                  });
              })
            )
          );
          Promise.all(feedQueue).then(fetchedContent => {
            console.log(fetchedContent)
            resolve(Object.fromEntries(Object.assign(fetchedContent as object)));
          })
          .catch(() => resolve({}))
        });
      };
    fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
    .then(parsedContent => {
      console.log(parsedContent)
      resolve(parsedContent)
    })
  })
}

  const { data } = useSWR(
    `fetchedContent-${selectedCategoryIndex}`,
    fetcher, 
    {
      suspense: true,
      errorRetryCount: 2
    }
  )

  if (!data) {
    return <></>
  }
  return (<pre>{JSON.stringify(data, null, 2)}</pre>)
  // return (
  //   <Grid container spacing={2}>
  //     {
  //       Object.values(fetchedContent as object)
  //       .map((parsedFeedContent: unknown) => {
          
  //         const feedTitleText = Object.entries(Object.assign({...parsedFeedContent as object}).title)
  //         .filter(titleEntry => {
  //           return titleEntry[0] === "$text"
  //         })
  //         .map(titleEntry => titleEntry[1])
  //         .concat(Object.assign({...parsedFeedContent as object}).title)
  //         .find(() => true)

  //         return (
  //           <ParsedFeedContentContext.Provider value={parsedFeedContent as object}>
  //             <Paper key={`${feedTitleText}`} elevation={3}>
  //               <Typography variant="h1" component="div" gutterBottom>
  //                 {`${feedTitleText}`}
  //               </Typography>
  //               <pre>{JSON.stringify(Object.assign({...parsedFeedContent as object}).title, null, 2)}</pre>
  //             </Paper>
  //           </ParsedFeedContentContext.Provider>
  //         )
  //       })
  //     }
  //   </Grid>
  // )
};

export default Feeds;

// {[0, 1, 2].map((item) => (
//   <ListItem key={`item-${sectionId}-${item}`}>
//     <ListItemText primary={} />
//   </ListItem>
// ))}
