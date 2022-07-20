import { FunctionComponent, useContext, createContext, useState, useEffect} from 'react';
import { ParsedFeedContentContext } from './Feed'
import { ClassifierContext } from './Classifier'
import Post from './Post'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'
import {
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';
import { useSettings } from '../react-hooks/useSettings'

import {ExpandMore} from '@mui/icons-material';
import {cleanPostItem, removePunctuation} from '../utils'
import stringSimilarity from 'string-similarity'
import MarkFeedProcessedButton from './MarkFeedProcessedButton'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator');

export type cleanPostItemType = {
  title: string,
  link: string,
  description: string
}

export const PostContext = createContext({});
const Posts: FunctionComponent = () => {

  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const classifierContext = useContext(ClassifierContext);
  const classifier = structuredClone(classifierContext);
  const {processedPosts} = useProcessedPosts()
  const [expanded, setExpanded] = useState<string | false>(false);
  const {settings} = useSettings()
  const {hideProcessedPosts, disableMachineLearning, mlThresholdDocuments, mlThresholdConfidence} = structuredClone(settings)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    //reload
  }, [processedPosts])

  return (
    <>
      {
      Object.entries(parsedFeedContent).map((feedContentEntry) => {
        const feedLink: string = feedContentEntry[0]

        const processedPostsForFeed = [Object.entries(processedPosts as object)
          .filter((feedEntry) => feedEntry[0] === feedLink)
          .map(feedEntry => feedEntry[1])]
          .flat(Infinity)

        const postsForFeed: cleanPostItemType[] = structuredClone(feedContentEntry[1]).items

        let classifierForCategory = bayes()

        try {
          if (classifier !== {}) {
            classifierForCategory = structuredClone(classifier) ? bayes.fromJson(JSON.stringify(classifier)) : bayes()
          }
        } catch (err) {
        // console.log(err)
        }

        const unprocessedCleanPostItems = [...postsForFeed]
          .filter((noEmpties) => !!noEmpties)
          .filter((noEmpties) => `${structuredClone(noEmpties as object).link}` !== ``)
          .map((postItem) => cleanPostItem(postItem))
          .filter((postItem: object) => {
            if (!hideProcessedPosts) {
              return true
            }
            // surpress previously processed posts
            const mlText = removePunctuation(`${structuredClone(postItem).title} ${structuredClone(postItem).description}`)
            return !processedPostsForFeed.find((postItem: string) => {
              const similarity = stringSimilarity.compareTwoStrings(`${removePunctuation(postItem)}`, mlText)
              return similarity > .8
            })
          })
          .filter((postItem: object) => {
            // surpress bayes thumbs down predictions
            const mlText = removePunctuation(`${structuredClone(postItem).title} ${structuredClone(postItem).description}`)
            if (disableMachineLearning) {
              return true
            }
            if (parseFloat(classifierForCategory.totalDocuments) < parseFloat(mlThresholdDocuments)) {
              return true
            }
            try {
              const prediction = classifierForCategory.categorize(`${mlText}`);
              const surpress = parseFloat(prediction.likelihoods ?.filter((likelihood: {proba: string}) => likelihood.proba !== `NaN`).find(
                (likelihood: object) => likelihood && structuredClone(likelihood).category === 'notgood'
              )?.proba || 0.0) > mlThresholdConfidence.value
              return !surpress
            } catch (error) {
              return true
            }
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
                    <Link href={feedLink} component="button">
                      {`${feedLink}`}
                    </Link>
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
                    {`${feedLink}`}
                  </Link>
                </Typography>
                <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} of ${[...postsForFeed as object[]].length} posts remaining)`}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {
                unprocessedCleanPostItems.map((cleanPostItem: object) => {
                  return (
                    <PostContext.Provider value={cleanPostItem} key={`postitem-swipeable-list-${structuredClone(cleanPostItem).link}`}>
                      <Post key={JSON.stringify(cleanPostItem)} />
                    </PostContext.Provider>
                  )
                })
              }
              <MarkFeedProcessedButton />
            </AccordionDetails>
          </Accordion>
        )
        })
      }
    </>
  )
}
export default Posts;