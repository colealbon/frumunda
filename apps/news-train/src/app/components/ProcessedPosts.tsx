import { resolve } from 'node:path/win32';
import React, {
  FunctionComponent,
  ReactNode,
  // createContext,
  useContext,
} from 'react';
// import {useProcessedPosts} from '../react-hooks/useProcessedPosts'
import useSWR from 'swr';
// import { BlockstackStorageContext } from './BlockstackSessionProvider';
import { ParsedFeedContentContext } from './Feed'
import { shortUrl } from '../utils.js'
// , unique, removePunctuation, removeTrackingGarbage} 

// export const ProcessedPostsContext = createContext({});

type Props = {children: ReactNode}

const ProcessedPosts: FunctionComponent<Props> = ({children}: Props ) => {
//   const blockstackStorageContext = useContext(BlockstackStorageContext);
//   const blockstackStorage = Object.assign(blockstackStorageContext);
  const parsedFeedContentContext = useContext(ParsedFeedContentContext)
  const parsedFeedContent = structuredClone(parsedFeedContentContext as object)
  const filenameForFeed = shortUrl(Object.keys(parsedFeedContent)[0])

  // const processedPostsForFeed = Object.entries(processedPosts as object)
  //   .filter(processedPostsEntry => {
  //       console.log(processedPostsEntry[0])
  //       return processedPostsEntry[0] === shortUrl(filenameForFeed)
  //   })
  //   .map(processedPostsEntry => processedPostsEntry[1])
  //   .find(() => true)

  
  // const feedContext = useContext(FeedContext)
  // const feed = Object.assign(feedContext)[0]
  // const filenameForFeed = `${shortUrl(feed)}`

  // const fetcher = (fileName: string, blockstackStorage: any) => {
  //   return new Promise(resolve => {
  //     const fetchQueue: any[] = []
  //     Object.values(blockstackFilenames)
  //     .filter(notEmpty => !!notEmpty)
  //     .filter((filename: any) => `${filename.toString()}` === filenameForFeed)
  //     .forEach((filename: any) => fetchQueue.push(
  //       blockstackStorage.getFile(`${filename.toString()}`, {decrypt: true})
  //       .then((fetchedContent: string) => {
  //         resolve(unique(fetchedContent.split(',').map((postText: string) => {
  //           return(removePunctuation(removeTrackingGarbage(postText)))
  //         })))
  //       })
  //     ))

  //     Promise.all(fetchQueue)
  //     .then(processedPosts => {
  //       resolve([])
  //     })
  //     .catch((error: any) => console.log(error))
  //     .finally(() => resolve([]))
  //   });
  // };

  const fetcher = () => {
    return new Promise(resolve => {
      resolve(filenameForFeed)
    })
  }

  const { data } = useSWR(`${filenameForFeed}`, fetcher, {
    suspense: true,
    shouldRetryOnError: false,
    //dedupingInterval: 600 * 1000,
    //revalidateOnFocus: false
  });

//   if (!!error) {
//     return <ProcessedPostsContext.Provider value={[]}>
//           <>{children}</>
//         </ProcessedPostsContext.Provider>
//   }

const fetchedProcessedPosts: string[] = data as string[]
return <div style={{
    color: 'red'
  }}>
    <pre>{JSON.stringify(fetchedProcessedPosts, null, 2)}</pre>
  </div>

//   return (
//     <ProcessedPostsContext.Provider value={processedPostsForFeed}>
//       <>{children}</>
//     </ProcessedPostsContext.Provider>
//   );
};

export default ProcessedPosts;
