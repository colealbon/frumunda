import {
  useContext,
  FunctionComponent,
  useState
} from 'react';
import {mutate} from 'swr'
import {
  IconButton,
  Typography
} from '@mui/material';
import { RemoveDone } from '@mui/icons-material';
import {
  cleanTags, 
  cleanPostItem, 
  removePunctuation, 
  shortUrl
} from '../utils'
import { cleanPostItemType } from './Posts'
import { ParsedFeedContentContext } from './Feed'
import { useStacks } from '../react-hooks/useStacks'

const MarkFeedProcessedButton: FunctionComponent = () => {
  const [inFlight, setInFlight] = useState(false)
  const { persist}  = useStacks()

  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const keyForFeed = Object.keys(parsedFeedContent)[0]
  const filenameForFeed = `processed_${shortUrl(keyForFeed)}`

  // const setProcessedPosts = () => {
  //         const newProcessedPosts: unknown[] = Array.from(new Set([...processedPosts, `${mlText}`.replace('undefined','')]))
  //       .filter(removeEmpty => !!removeEmpty)
  //     mutate(
  //       processedFilenameForFeed, 
  //       persist(processedFilenameForFeed, newProcessedPosts),
  //       {optimisticData: newProcessedPosts}
  //     )
  //   persistProcessedPosts(newPosts)
  //   setInFlight(true)
  // }

  const markFeedComplete = (newProcessedPostsForFeed: string[]) => {
    setInFlight(true)
    mutate(
      `${filenameForFeed}`, 
      persist(`${filenameForFeed}`, newProcessedPostsForFeed),
      {optimisticData: newProcessedPostsForFeed}
    )
  }

  return (
    <>
      {
        Object.entries(parsedFeedContent).map((feedContentEntry) => {
          const feedLink: string = feedContentEntry[0]
          const feedTitleText: string = cleanTags(structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`)
          const processedPosts = structuredClone({...feedContentEntry[1] as object}).items
            .map((postItem: cleanPostItemType) => cleanPostItem(postItem))
            .map((postItem: cleanPostItemType) => removePunctuation(`${postItem.title} ${postItem.description}`))
          
          return (
            <Typography key={feedLink}>
              <IconButton 
                title="mark articles completed"
                aria-label="mark articles completed" 
                onClick={() => markFeedComplete(processedPosts)}
                disabled={inFlight}
              >
                <RemoveDone />
              </IconButton>
              <Typography variant='caption'>{` mark all ${processedPosts.length} "${feedTitleText}" posts as processed `}</Typography>
            </Typography>
          )
        })
      }
    </>
  )
};

export default MarkFeedProcessedButton;
