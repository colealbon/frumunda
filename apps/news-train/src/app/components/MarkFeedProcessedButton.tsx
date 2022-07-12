import React, { useContext, useCallback, FunctionComponent} from 'react';
import { IconButton, Typography} from '@mui/material';
import { RemoveDone } from '@mui/icons-material';
import {cleanTags, cleanPostItem, removePunctuation, shortUrl} from '../utils'
import {cleanPostItemType} from './Posts'
import { ParsedFeedContentContext } from './Feed'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'


const MarkFeedProcessedButton: FunctionComponent = () => {
  const {processedPosts, persistProcessedPosts} = useProcessedPosts();
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);

  const setProcessedPostsCallback = useCallback((newPosts: object) => {
    persistProcessedPosts(newPosts)
  }, [persistProcessedPosts])

  const markFeedComplete = (feedLink: string, newProcessedPostsForFeed: string[]) => {
    const newProcessedPosts = structuredClone(processedPosts)
    newProcessedPosts[`${feedLink}`] = newProcessedPostsForFeed.flat(Infinity).slice()
    setProcessedPostsCallback(newProcessedPosts)
  }

  return (
    <>
      {
        Object.entries(parsedFeedContent).map((feedContentEntry) => {
          const feedLink: string = feedContentEntry[0]
          const feedTitleText: string = cleanTags(structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`)
          const newProcessedPosts = structuredClone({...feedContentEntry[1] as object}).items
            .map((postItem: cleanPostItemType) => cleanPostItem(postItem))
            .map((postItem: cleanPostItemType) => removePunctuation(`${postItem.title} ${postItem.description}`))
          
          return (
            <Typography key={feedLink}>
              <IconButton 
                title="mark articles completed"
                aria-label="mark articles completed" 
                onClick={() => markFeedComplete(feedLink, newProcessedPosts)}
              >
                <RemoveDone />
              </IconButton>
              <Typography variant='caption'>{` mark all ${newProcessedPosts.length} "${feedTitleText}" posts as processed `}</Typography>
            </Typography>
          )
        })
      }
    </>
  )
};

export default MarkFeedProcessedButton;
