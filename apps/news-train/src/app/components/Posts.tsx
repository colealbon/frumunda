import { FunctionComponent, useContext, createContext, useState} from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'
import {
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  List
} from '@mui/material';
import {ExpandMore} from '@mui/icons-material';
import {cleanTags, cleanPostItem, removePunctuation} from '../utils'
import stringSimilarity from 'string-similarity'
import MarkFeedProcessedButton from './MarkFeedProcessedButton'

export type cleanPostItemType = {
  title: string,
  link: string,
  description: string
}

export const PostContext = createContext({});

const Posts: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const {processedPosts} = useProcessedPosts()
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {
      Object.entries(parsedFeedContent).map((feedContentEntry) => {
      const feedLink: string = feedContentEntry[0]
      const feedTitleText: string = cleanTags(structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`)
      const feedDescription = cleanTags(structuredClone({...feedContentEntry[1] as object}).description["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).description}`)
      const processedPostsForFeed = [Object.entries(processedPosts as object)
        .filter((feedEntry) => feedEntry[0] === feedLink)
        .map(feedEntry => feedEntry[1])]
        .flat(Infinity)

      const postsForFeed = structuredClone({...feedContentEntry[1] as object}).items

      const unprocessedCleanPostItems = postsForFeed.map((postItem: cleanPostItemType) => cleanPostItem(postItem))
        .filter((postItem: cleanPostItemType) => {
          const mlText = removePunctuation(`${postItem.title} ${postItem.description}`)
          return !processedPostsForFeed.find((postItem: string) => {
            const similarity = stringSimilarity.compareTwoStrings(`${removePunctuation(postItem)}`, mlText)
            return similarity > .82
          })
        })

        if (unprocessedCleanPostItems.length === 0) {
          return (
            <Accordion expanded={false} key={`accordion-${feedLink}`}>
              <AccordionSummary
                aria-controls={`${feedLink}-content`}
                id={`${feedLink}-header`}
                key={`accordion-${feedLink}`}
              >
                <Box   
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  key={`box-${feedLink}`}
                >
                  <Typography variant='h3'>
                    <Link href={`${feedLink}`} component="button">
                      {`${feedTitleText}`}
                    </Link>
                  </Typography>
                  <Typography variant="caption">
                    {` ${feedDescription}`}
                  </Typography>
                  <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} posts remaining)`}</Typography>
                </Box>
              </AccordionSummary>
            </Accordion>

          )
        }
        return (
          <Accordion 
            expanded={expanded === `panel-${feedLink}`} 
            onChange={handleChange(`panel-${feedLink}`)}
            key={`accordion-${feedLink}`}
          >
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${feedLink}-content`}
                id={`${feedLink}-header`}
                key={`${feedLink}-header`}
              >
                <Box   
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                >
                  <Typography variant='h3'>
                    <Link href={`${feedLink}`} component="button">
                      {`${feedTitleText}`}
                    </Link>
                  </Typography>
                  <Typography variant="caption">
                    {` ${feedDescription}`}
                  </Typography>
                  <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} of ${postsForFeed.length} posts remaining)`}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {
                    unprocessedCleanPostItems.map((cleanPostItem: cleanPostItemType) => {
                      return (
                        <div key={cleanPostItem.link}>
                          <PostContext.Provider
                            value={cleanPostItem}
                            
                          >
                            <Post key={JSON.stringify(cleanPostItem)} />
                          </PostContext.Provider>
                        </div>
                      )
                    })
                  }
                  <MarkFeedProcessedButton />
                </List>
              </AccordionDetails>
          </Accordion>
        )
        })
      }
    </>
  )
}

export default Posts;