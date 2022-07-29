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

  const markFeedComplete = (newProcessedPostsForFeed: string[]) => {
    setInFlight(true)
    const processedPostsWithLabel = JSON.parse(`{"${filenameForFeed}": ${JSON.stringify(newProcessedPostsForFeed)}}`)

    mutate(
      `${filenameForFeed}`, 
      persist(`${filenameForFeed}`, processedPostsWithLabel),
      {optimisticData: processedPostsWithLabel}
    )
  }

  return (
    <>
      {
        Object.entries(parsedFeedContent).map((feedContentEntry) => {
          const feedLink: string = feedContentEntry[0]
          const currentPosts = structuredClone({...feedContentEntry[1] as object}).items
            .map((postItem: cleanPostItemType) => cleanPostItem(postItem))
            .map((postItem: cleanPostItemType) => removePunctuation(`${postItem.title} ${postItem.description}`))
          
          return (
            <Typography key={feedLink}>
              <IconButton 
                title="mark articles completed"
                aria-label="mark articles completed" 
                onClick={() => markFeedComplete(currentPosts)}
                disabled={inFlight}
              >
                <RemoveDone />
              </IconButton>
              <Typography variant='caption'>{`mark all posts for feed complete`}</Typography>
            </Typography>
          )
        })
      }
    </>
  )
};

export default MarkFeedProcessedButton;
