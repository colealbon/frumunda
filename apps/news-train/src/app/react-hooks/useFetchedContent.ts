// import { useEffect, useState, useCallback} from 'react';
import useSWR  from 'swr';
import axios from 'axios';
// import localforage from 'localforage'
// import { useStacks } from '../react-hooks/useStacks'
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useFeeds } from '../react-hooks/useFeeds'
import { useCorsProxies } from '../react-hooks/useCorsProxies'

export function useFetchedContent () {
// const { stacksStorage, stacksSession }  = useStacks()
// const [fetchedContent, setFetchedContent] = useState(defaultFetchedContent)
  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const { feeds } = useFeeds()
  const { corsProxies } = useCorsProxies();

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
              console.log(response)
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
    // console.log(feeds)
    // console.log(corsProxies)
    // console.log(checkedCorsProxies)
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
              .catch(() => resolve({}));
          })
        )
      );
      Promise.all(feedQueue).then(fetchedContent => {
        resolve(fetchedContent);
      })
      .catch(() => resolve({}))
    });
  };


//   const setFetchedContentCallback = useCallback((newFetchedContent: unknown) => {
//     const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent as object))
//     setFetchedContent(newFetchedContentClone)
//   }, [ setFetchedContent])

//   useEffect(() => {
//     localforage.getItem('fetchedContent')
//     .then((value: unknown) => {
//       if (!value) {
//         return
//       }
//       setFetchedContentCallback(value)
//     })
//   }, [setFetchedContentCallback])

//   const fallback = JSON.parse(JSON.stringify(fetchedContent))

  const fetcher = () => {
    console.log('fetcher')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({fetchedContent: fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)})
      }, 2000)
//       stacksStorage.getFile(`fetchedContent`, {
//         decrypt: true
//       })
//       .then((content) => {
//         const fetchedFetchedContent: object = JSON.parse(`${content}`)
//         resolve(fetchedFetchedContent)
//       })
//       .catch(error => reject())
    })
  }

  const { data } = useSWR(
    `fetchedContent-${selectedCategoryIndex}`,
    fetcher , 
    {
      suspense: true

      // fallbackData: fallback,
      // shouldRetryOnError: true,
      // errorRetryInterval: 6000,
      // dedupingInterval: 10000,
      // focusThrottleInterval: 6000,
      // errorRetryCount: 3
    }
  )

//   const [inFlight, setInFlight] = useState(false)

//   const publishFetchedContent = useCallback((newFetchedContent: unknown) => {
//     setInFlight(true)
//     const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent as object))
//     const options = { optimisticData: newFetchedContentClone, rollbackOnError: true }
//     const updateFn = (newFetchedContent: object) => {
//       const newFetchedContentClone = JSON.parse(JSON.stringify(newFetchedContent))
//       return new Promise((resolve) => {
//         if( !stacksSession.isUserSignedIn() ) {
//           localforage.setItem('fetchedContent', newFetchedContentClone)
//           setInFlight(false)
//           resolve(newFetchedContentClone)
//           return
//         }
//         stacksStorage.putFile(`fetchedContent`, JSON.stringify(newFetchedContentClone))
//         .catch((error) => console.log(error))
//         .finally(() => {
//           localforage.setItem('fetchedContent', newFetchedContentClone)
//           setInFlight(false)
//           resolve(newFetchedContentClone)
//           return 
//         })
//       })
//     }
//     mutate(updateFn(newFetchedContentClone), options);
//   }, [ mutate, stacksSession, stacksStorage])
  
  const fetchedContent: unknown = Object.assign(data as object)

  return {
    fetchedContent
  }
}