import React, {
  FunctionComponent,
  ReactNode
  //,
  // createContext,
  // useContext,
} from 'react';
// import useSWR from 'swr';
// import { BlockstackStorageContext } from './BlockstackSessionProvider';
// import { BlockstackFilenamesContext } from './BlockstackFilenamesFetch';
// import { FeedContext }  from './Posts'
// import { shortUrl, unique, removePunctuation, removeTrackingGarbage} from '../index.js'

// export const ProcessedPostsContext = createContext({});

type Props = {children: ReactNode}

const ProcessedPostsLoad: FunctionComponent<Props> = ({children}: Props ) => {
//   const blockstackStorageContext = useContext(BlockstackStorageContext);
//   const blockstackStorage = Object.assign(blockstackStorageContext);
//   const blockstackFilenamesContext = useContext(BlockstackFilenamesContext);
//   const blockstackFilenames = { ...blockstackFilenamesContext };
//   const feedContext = useContext(FeedContext)
//   const feed = Object.assign(feedContext)[0]
//   const filenameForFeed = `${shortUrl(feed)}`

//   const fetcher = (fileName: string, blockstackStorage: any) => {
//     return new Promise(resolve => {

//       const fetchQueue: any[] = []
//       Object.values(blockstackFilenames)
//       .filter(notEmpty => !!notEmpty)
//       .filter((filename: any) => `${filename.toString()}` === filenameForFeed)
//       .forEach((filename: any) => fetchQueue.push(
//         blockstackStorage.getFile(`${filename.toString()}`, {decrypt: true})
//         .then((fetchedContent: string) => {
//           resolve(unique(fetchedContent.split(',').map((postText: string) => {
//             return(removePunctuation(removeTrackingGarbage(postText)))
//           })))
//         })
//       ))

//       Promise.all(fetchQueue)
//       .then(processedPosts => {
//         resolve([])
//       })
//       .catch((error: any) => console.log(error))
//       .finally(() => resolve([]))
//     });
//   };

//   const { data, error } = useSWR([filenameForFeed, blockstackStorage], fetcher, {
//     suspense: true,
//     shouldRetryOnError: false,
//     //dedupingInterval: 600 * 1000,
//     //revalidateOnFocus: false
//   });

//   if (!!error) {
//     return <ProcessedPostsContext.Provider value={[]}>
//           <>{children}</>
//         </ProcessedPostsContext.Provider>
//   }

//   const fetchedProcessedPosts: string[] = data as string[]
  // return (
  //   <ProcessedPostsContext.Provider value={fetchedProcessedPosts}>
  //     <>{children}</>
  //   </ProcessedPostsContext.Provider>
  // );
  return (<>{children}</>)
};

export default ProcessedPostsLoad;
