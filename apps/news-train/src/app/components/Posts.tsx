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
import defaultFeeds from '../react-hooks/defaultFeeds.json'


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

  const {fetchFile, fetchFileLocal} = useStacks()

  const { data: feedsdata } = useSWR('feeds', fetchFileLocal('feeds', defaultFeeds))
  const feeds = {...feedsdata as object}
  const {data: selectedCategory} = useSWR('selectedCategory')
  const {data: classifierdata} = useSWR(`classifier_${selectedCategory}`.replace(/_$/, ""))
  const defaultProcessedPosts = JSON.parse(`{"${processedFilenameForFeed}":[]}`)
  const {data: processedPostsdata} = useSWR(processedFilenameForFeed, () => fetchFile(processedFilenameForFeed, defaultProcessedPosts))
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
        const feedTitle: string = structuredClone(feedContentEntry[1]).title
        const feedDescription: string = structuredClone(feedContentEntry[1]).description

        const feedLabel = Object.entries(feeds)
        .filter(feedEntry => feedEntry[0] === feedLink)
        .map(feedEntry => Object.entries(feedEntry[1] as object))
        .flat()
        .filter((feedValEntry: unknown[]) => feedValEntry[0] === 'label')
        .map(feedLabelEntry => feedLabelEntry[1])
        .find(() => true)

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
              <Typography variant='h3' style={{ maxWidth: '300px' , justifyContent: 'center'}}>
                <Link href={feedLink} component="button">
                  {`${feedLabel || feedTitle || feedLink}`}
                </Link>
              </Typography>
            </Fragment>
          )
        }
        return (
          <Fragment key={feedLink}>
            <Divider />
            <Typography style={{display: 'flex', flexDirection: 'column', maxWidth: '300px'}}>
              <Link href={`${feedLink}`} component="button">
                {`${feedLabel || feedTitle || feedLink}`}
              </Link>
              <Typography variant='caption' style={{display: 'flex', justifyContent: 'center'}}>
              {feedDescription}
              </Typography>
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