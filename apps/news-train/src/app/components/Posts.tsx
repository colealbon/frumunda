import React, { FunctionComponent, useEffect } from 'react';
import useSWR  from 'swr';
import axios from 'axios';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'
import { useCorsProxies } from '../react-hooks/useCorsProxies'

const Posts: FunctionComponent = () => {

  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { feeds } = useFeeds()
  const { corsProxies } = useCorsProxies();

  useEffect(() => {
    // console.log(corsProxies)
  }, [corsProxies])
  
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
          console.log(`${corsProxyItem}${feedUrl}`)
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
      .then(fetchedContent => resolve(fetchedContent))
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
    <pre>
      {JSON.stringify(fetchedContent, null, 2)}
    </pre>
  )
};

export default Posts;

// // import { useFeeds } from '../react-hooks/useFeeds'
// // import { useCorsProxies } from '../react-hooks/useCorsProxies'
// // import axios from 'axios';

// const Posts = () => {
// //   const { feeds } = useFeeds()
// //   const { corsProxies } = useCorsProxies()
  
//   const { fetchedContent } = useFetchedContent()

// //   const getCheckedCorsProxies = () => Object.entries(corsProxies)
// //     .filter(
// //       (corsProxyEntry: [string, unknown]) =>
// //         Object.assign(corsProxyEntry[1] as object).checked === true
// //     )
// //     .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])

  

// //   const fetchFeedContent = (feedUrl: string, corsProxies: string[]): Promise<object> => {
// //     return new Promise((resolve, reject) => {
// //       const [corsProxy, ...rest] = corsProxies;
// //       [corsProxy]
// //         .flat()
// //         .filter(corsProxyItem => {
// //           return !!corsProxyItem;
// //         })
// //         .forEach(corsProxyItem => {
// //           axios
// //             .get(`${corsProxyItem}${feedUrl}`)
// //             .then(response => {
// //               resolve(response);
// //               return;
// //             })
// //             .catch(() => {
// //               if (rest.length === 0) {
// //                 reject();
// //               }
// //               fetchFeedContent(feedUrl, rest);
// //             });
// //         });
// //     });
// //   };

// //   const filteredFeeds = getCheckedFeedsForCategory(`${selectedCategoryIndex}`)
// //   const filteredCorsProxies = getCheckedCorsProxies()

// //   const setFetchedContentCallback = useCallback((fetchedContent: object) => {
// //     setFetchedContent(fetchedContent)
// //   }, [setFetchedContent])

// //   useEffect(() => {
// //     const fetchFeedContentMulti = (feeds: string[], corsProxies: string[]): Promise<object> => {
// //       return new Promise((resolve, reject) => {
// //         const feedQueue: object[] = [];
// //         Object.values(feeds).map(feed =>
// //           feedQueue.push(
// //             new Promise((resolve, reject) => {
// //               fetchFeedContent(feed, corsProxies)
// //                 .then((fetchedContent: object) => {
// //                   console.log(fetchedContent)
// //                   //resolve(fetchedContent)
// //                   [fetchedContent].flat().forEach(fetchedContentItem => {
// //                     resolve(fetchedContent);
// //                   });
// //                 })
// //                 .catch(() => resolve({}));
// //             })
// //           )
// //         );
// //         Promise.all(feedQueue).then((fetchedContent) => {
// //           resolve(fetchedContent);
// //         })
// //         .catch((error) => {
// //           console.log(error)
// //           reject(error)
// //         })
// //       });
// //     };

// //     fetchFeedContentMulti(filteredFeeds, filteredCorsProxies)
// //     .then(fetchedContent => {
// //       setFetchedContentCallback(fetchedContent)
// //     })
// //   }, [selectedCategoryIndex, selectedPageIndex])
// //   // console.log(filteredCorsProxies)
// //   // const fetcher = fetchFeedContentMulti(filteredFeeds, filteredCorsProxies)

// //   // const { data } = useSWR(
// //   //   'selectedCategoryIndex',
// //   //   fetcher,
// //   //   {suspense: true}
// //   // )

// //   // const fetchedFeeds = Object.assign({...fetchedContent})

//   return (
//     <>
//       <div><pre>{`${JSON.stringify(fetchedContent, null, 2)}`}</pre></div>
//       {
//         // JSON.stringify(fetchedContent, null, 2)
//         // .map((feed: string) => {
//         //   return <div key={feed}><pre>{JSON.stringify(fetchedFeeds, null, 2)}</pre></div>
//         // })
//       }
//     </>
//   );
// };

// export default Posts;
