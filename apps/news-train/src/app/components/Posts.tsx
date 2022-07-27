import { 
  FunctionComponent, 
  useContext, 
  createContext, 
  Fragment
} from 'react';
import { ParsedFeedContentContext } from './Feed'
import useSWR from 'swr'
import Post from './Post'
import {
  Link,
  Typography,
  Divider
} from '@mui/material';
import { useSettings } from '../react-hooks/useSettings'
import {useStacks} from '../react-hooks/useStacks'


import {shortUrl, cleanPostItem, removePunctuation} from '../utils'
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
  const keyForFeed = Object.keys(parsedFeedContent)[0]
  const processedFilenameForFeed = `processed_${shortUrl(keyForFeed)}`

  const {settings} = useSettings()
  const {hideProcessedPosts, disableMachineLearning, mlThresholdDocuments, mlThresholdConfidence} = structuredClone(settings)

  const {fetchFile} = useStacks()

  const {data: selectedCategory} = useSWR('selectedCategory')
  const {data: classifierdata} = useSWR(`classifier_${selectedCategory}`.replace(/_$/, ""))
  const {data: processedPostsdata} = useSWR(`${processedFilenameForFeed}`, fetchFile(processedFilenameForFeed, {}))
  const processedPosts = Object.values({...processedPostsdata as object}).flat().slice()

  let classifier = bayes()

  try {
    if (classifierdata) {
      classifier = bayes.fromJson(JSON.stringify(classifierdata))
    }
  } catch (error) {
    console.log(error)
  }

  return (
    <>
      {
      Object.entries(parsedFeedContent).map((feedContentEntry) => {
        const feedLink: string = feedContentEntry[0]
        const unprocessedCleanPostItems = structuredClone(feedContentEntry[1]).items
          .filter((noEmpties: object) => !!noEmpties)
          .filter((noEmpties: object) => !!structuredClone(noEmpties).link)
          .map((postItem: cleanPostItemType) => cleanPostItem(postItem))
          .filter((postItem: object) => {
            if (!hideProcessedPosts) {
              return true
            }
            // surpress previously processed posts
            const mlText = removePunctuation(`${structuredClone(postItem).title} ${structuredClone(postItem).description}`)
            return !processedPosts.find(processedMLText => {
              const similarity = stringSimilarity.compareTwoStrings(`${removePunctuation(`${processedMLText}`)}`, mlText)
              return similarity > .8
            })
          })
          .filter((postItem: object) => {
            // surpress bayes thumbs down predictions
            const mlText = removePunctuation(`${structuredClone(postItem).title} ${structuredClone(postItem).description}`)
            if (disableMachineLearning) {
              return true
            }
            if (parseFloat(classifier.totalDocuments) < parseFloat(mlThresholdDocuments)) {
              return true
            }
            try {
              const prediction = classifier.categorize(`${mlText}`);
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
            <Fragment key={feedLink}>
              <Divider />
              <Typography variant='h3'>
                <Link href={feedLink} component="button">
                  {`${feedLink}`}
                </Link>
              </Typography>
            </Fragment>
          )
        }
        return (
          <Fragment key={feedLink}>
            <Divider />
            <Typography variant='h3'>
              <Link href={`${feedLink}`} component="button">
                {`${feedLink}`}
              </Link>
            </Typography>
            <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} of ${structuredClone(feedContentEntry[1]).items.length} posts remaining)`}</Typography>
            <Divider />
            {
              unprocessedCleanPostItems.map((cleanPostItem: object) => {
                return (  
                    <Fragment key={JSON.stringify(cleanPostItem)}>
                    <PostContext.Provider value={cleanPostItem} key={`postitem-swipeable-list-${structuredClone(cleanPostItem).link}`}>
                      <Post key={JSON.stringify(cleanPostItem)} />
                    </PostContext.Provider>
                    </Fragment>
                )
              })
            }
          <MarkFeedProcessedButton />
          </Fragment>
        )
        })
      }
    </>
  )
}
export default Posts;