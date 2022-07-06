import React, { useContext, useState, useCallback } from 'react';
// import { FeedContext } from './Posts'
import { IconButton } from '@mui/material';
import { RemoveDone } from '@mui/icons-material';
// import htmlToText from 'html-to-text';
// import { useProcessedPosts } from '../custom-hooks/useProcessedPosts'
// import { ParsedFeedContentContext } from './FeedContentParse';
// import { removePunctuation, removeTrackingGarbage, shortUrl } from '../index.js'
// import { useDebouncedCallback } from 'use-debounce';
// import { BlockstackStorageContext, BlockstackSessionContext } from './BlockstackSessionProvider';

// var entries = require('object.entries')

const MarkFeedProcessedButton = () => {
const [buttonDisabled, setButtonDisabled] = useState(false)
//   const blockstackStorageContext = useContext(BlockstackStorageContext);
//   const blockstackStorage = Object.assign(blockstackStorageContext);
//   const setButtonDisabledCallback = useCallback((newState) => setButtonDisabled(newState), [])
//   const blockstackSessionContext = useContext(BlockstackSessionContext);
//   const blockstackSession = Object.assign(blockstackSessionContext);
//   const parsedFeedContentContext = useContext(ParsedFeedContentContext);
//   const parsedFeedContent = Object.assign(parsedFeedContentContext)
//   const feedContext = useContext(FeedContext)
//   const feed = Object.assign(feedContext)[0]
//   const {processedPosts, setProcessedPosts} = useProcessedPosts();

//   const setProcessedPostsCallback = useCallback((newPosts) => {
//     setProcessedPosts(newPosts)
//   }, [setProcessedPosts])

//   const publishProcessedPosts = useDebouncedCallback((newProcessedPosts: string) => {
//     const contentToUpload = `${newProcessedPosts}`
//     const uploadFilename = `${shortUrl(feed)}`
//     blockstackStorage.putFile(`${uploadFilename}`, `${contentToUpload}`, {
//       encrypt: true
//     })
//     .then((successMessage: string) => {})
//     .catch((error: any) => console.log(error))
//   }, 5000, { leading: true })

  const markFeedComplete = () => {
    alert('you are a tiger!')
    alert('le tigre')

//     const postsForFeed = entries(parsedFeedContent as object)
//     .filter((feedContentEntry: [string, object]) => {
//       return feedContentEntry[0] === feed
//     })
//     .filter((parsedFeedEntry: [string, object]) => {
//       return parsedFeedEntry[1];
//     })
//     .map((parsedFeedEntry:[string, any]) => {
//       return parsedFeedEntry[1][0];
//     })
//     .map((parsedFeedEntryContent: any) => {
//       return parsedFeedEntryContent.map(
//       (postItem: { title?: string , link?:string, description?:string}) => {
//         const theDescription = `${postItem.description}`
//         const descriptionText = htmlToText.fromString(theDescription, {
//           ignoreHref: true,
//           ignoreImage: true,
//         });
//         const theTitle = `${postItem.title}`
//         const mlText = removePunctuation(removeTrackingGarbage(`${theTitle} ${descriptionText}`))
//         return mlText
//       })
//     }).flat(Infinity)

//     const processedPostsForFeed = [entries(processedPosts)
//       .filter((feedEntry: [string, string[]]) => feedEntry[0] === feed)
//       .map((feedEntry: [string, string[]]) => feedEntry[1])]
//       .flat(Infinity)
//       .map((postEntry: string) => removePunctuation(removeTrackingGarbage(postEntry)))

//     const newProcessedPostsForFeed = Array.from(new Set([...processedPostsForFeed, ...postsForFeed]))

//     const newProcessedPosts = Object.assign({...processedPosts as object})
//     newProcessedPosts[`${feed}`] = [...newProcessedPostsForFeed]

//     setProcessedPostsCallback(newProcessedPosts)
//     blockstackSession.isUserSignedIn() && publishProcessedPosts(JSON.stringify(newProcessedPostsForFeed))
//     setButtonDisabledCallback(true)

  }

  return (
    <IconButton title="mark articles completed"  aria-label="mark articles completed" onClick={markFeedComplete} disabled={buttonDisabled}>
      <RemoveDone style={{ fontSize: 60 }} />
    </IconButton>
  )
};

export default MarkFeedProcessedButton;
