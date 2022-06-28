import React, { FunctionComponent } from 'react';
import { useFetchedContent } from '../react-hooks/useFetchedContent'

const Posts: FunctionComponent = () => {
  const { fetchedContent } = useFetchedContent()

  return (
    <pre>
      {JSON.stringify(fetchedContent, null, 2)}
    </pre>
  )
};

export default Posts;


// import { useFetchedContent } from '../react-hooks/useFetchedContent'
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
