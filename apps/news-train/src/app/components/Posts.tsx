import React, { FunctionComponent, useContext } from 'react';
import { ParsedFeedContentContext } from './Feeds';

// import useSWR  from 'swr';
// import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
// import { useFeeds } from '../react-hooks/useFeeds'
// import { useCorsProxies } from '../react-hooks/useCorsProxies'
// import { useStacks } from '../react-hooks/useStacks'
// import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { parse } = require('rss-to-json');

const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);

//   const { selectedCategoryIndex } = useSelectedCategoryIndex();
//   const { feeds } = useFeeds()
//   const { corsProxies } = useCorsProxies();
//   const { selectedPageIndex } = useSelectedPageIndex();
//   const { stacksSession } = useStacks()

//   useEffect(() => {
//     // reload
//     console.log('FeedsDispay')
//   }, [ stacksSession, corsProxies, selectedCategoryIndex, feeds, selectedPageIndex ])
  
//   const checkedFeedsForCategory = Object.entries(feeds)
//     .filter(feedEntry => {
//       if (`${selectedCategoryIndex}` === 'allCategories') {
//         return feedEntry
//       }
//       return Object.entries(feedEntry[1] as object)
//         .filter(feedEntryAttribute => {
//           return feedEntryAttribute[0] === 'categories';
//         })
//         .find(feedEntryAttribute => {
//           return [feedEntryAttribute[1]].flat().indexOf(`${selectedCategoryIndex}`) !== -1;
//         });
//     })
//     .filter((feedEntry) => {
//       return Object.entries(feedEntry[1] as object)
//         .filter(feedEntryAttribute => {
//           return feedEntryAttribute[0] === 'checked';
//         })
//         .filter(feedEntryAttribute => {
//           return feedEntryAttribute[1] === true;
//         })
//         .find(() => true);
//     })
//     .map((feedEntry) => feedEntry[0])

//     const checkedCorsProxies = Object.entries(corsProxies)
//     .filter(corsProxyEntry => Object.assign(corsProxyEntry[1] as object).checked === true)
//     .map((corsProxyEntry: [string, unknown]) => corsProxyEntry[0])
//     .filter(noblanks => !!noblanks);

//   const fetchFeedContent = (feedUrl: string, corsProxies: string[]): Promise<object> => {
//     return new Promise((resolve, reject) => {
//       const [corsProxy, ...rest] = corsProxies;
//       [corsProxy]
//         .flat()
//         .filter(corsProxyItem => {
//           return !!corsProxyItem;
//         })
//         .forEach(corsProxyItem => {
//           parse(`${corsProxyItem}${feedUrl}`)
//             .then((response: object) => {
//               resolve(response);
//               return;
//             })
//             .catch(() => {
//               if (rest.length === 0) {
//                 reject();
//               }
//               fetchFeedContent(feedUrl, rest);
//             });
//         });
//     });
//   };
//   const fetchFeedContentMulti = (feeds: string[], corsProxies: string[]): Promise<object> => {
//     return new Promise((resolve, reject) => {
//       const feedQueue: object[] = [];
//       Object.values(feeds).map(feed =>
//         feedQueue.push(
//           new Promise((resolve, reject) => {
//             fetchFeedContent(feed, corsProxies)
//               .then((fetchedContent: object) => {
//                 return [fetchedContent].flat().forEach(fetchedContentItem => {
//                   resolve([feed, fetchedContent]);
//                 });
//               })
//               .catch((error) => {
//                 resolve({})
//               });
//           })
//         )
//       );
//       Promise.all(feedQueue).then(fetchedContent => {
//         resolve(Object.fromEntries(Object.assign(fetchedContent as object)));
//       })
//       .catch(() => resolve({}))
//     });
//   };
//   const fetcher = () => {
//     return new Promise((resolve, reject) => {
//       fetchFeedContentMulti(checkedFeedsForCategory, checkedCorsProxies)
//       .then(parsedContent => {
//         //console.log(parsedContent)
//         resolve(parsedContent)
//       })
//       .catch(error => reject(error))
//     })
//   }

//   const { data } = useSWR(
//     `fetchedContent-${selectedCategoryIndex}`,
//     fetcher, 
//     {
//       suspense: true
//     }
//   )
  
//   const fetchedContent: unknown = Object.assign(data as object)

  return (
    <pre>
      {JSON.stringify(parsedFeedContentContext, null, 2)}
    </pre>
  )
};

export default PostsDisplay;
