import { FunctionComponent, useContext } from 'react';
import useSWR, {mutate} from 'swr'
import styled from 'styled-components';
import { removePunctuation, shortUrl } from '../utils'
import { PostContext } from './Posts';
import { ParsedFeedContentContext } from './Feed'
import { CategoryContext } from './Category'
import { useStacks } from '../react-hooks/useStacks'

import {
  ThumbDown,
  ThumbUp
} from '@mui/icons-material'
import {
    Link
} from '@mui/material';
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator')

const Post: FunctionComponent = () => {
  const { 
    persist, 
    fetchFile 
  } = useStacks()

  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
  const categoryContext = useContext(CategoryContext)
  const category = `${categoryContext}`
  const id = `${postItem.link}`

  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const keyForFeed = Object.keys(parsedFeedContent)[0]
  const processedFilenameForFeed = `processed_${shortUrl(keyForFeed)}`

  const mlText = removePunctuation(`${postItem.title} ${postItem.description} ${postItem.summary}`)

  
  const {data: classifierdata} = useSWR(`classifier_${category}`, () => fetchFile(`classifier_${category}`, JSON.parse(classifier.toJson()) ))
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

  const handleTrain = (label: string) => {
    classifier.learn(`${mlText}`, label)
    const newClassifier = JSON.parse(classifier.toJson())
    const filenameForClassifier = `classifier_${category}`.replace(/_$/,'')
    const newProcessedPosts: unknown[] = Array.from(new Set([...processedPosts, `${mlText}`.replace('undefined','')]))
    .filter(removeEmpty => !!removeEmpty)
    const payloadProcessedPosts = JSON.parse(`{"${processedFilenameForFeed}": ${JSON.stringify(newProcessedPosts)}}`)
    
    mutate(
      processedFilenameForFeed,
      persist(processedFilenameForFeed, payloadProcessedPosts),
      {
        optimisticData: payloadProcessedPosts,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false
      }
    )

    mutate(
      filenameForClassifier,
      persist(filenameForClassifier, newClassifier),
      {
        optimisticData: newClassifier,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false
      }
    )
  }

  const handleOnClick = () => () => {
    // console.log('[handle on click]', id);
  };

  let predictionNotGood = -.001
  let predictionGood = -.001

  try {
    if (classifier !== undefined) {
      const prediction = classifier.categorize(`${mlText}`);
      predictionNotGood = parseFloat(prediction.likelihoods ?.filter((likelihood: {proba: string}) => likelihood.proba !== `NaN`).find(
        (likelihood: {category: string}) => likelihood && likelihood.category === 'notgood'
      )?.proba || 0.0)
  
      predictionGood = parseFloat(prediction.likelihoods ?.filter((likelihood: {proba: string}) => likelihood.proba !== `NaN`).find(
        (likelihood: {category: string}) => likelihood && likelihood.category === 'good'
      )?.proba || 0.0)
    }
  } catch(err) {
    // console.log(err)
  }

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={() => handleTrain('good')} destructive={true}>
        <ActionContent>
          <ItemColumnCentered>
          {`${category}`}
            <span className="icon">
              <ThumbUp />
            </span>
            {`${Math.round(predictionGood * 100)}%`}
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => handleTrain('notgood')}>
        <ActionContent>
          <ItemColumnCentered>
            {`${category}`}
            <span className="icon">
              <ThumbDown />
            </span>
            {`${Math.round(predictionNotGood * 100)}%`}
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
    </TrailingActions>
  );

  return (
      <div style={{width: '100%'}} className="basic-swipeable-list__container" key={postItem.link} >
        <SwipeableList
          fullSwipe={true}
          threshold={.5}
          type={ListType.IOS}
        >
          <SwipeableListItem
            key={id}
            leadingActions={leadingActions()}
            trailingActions={trailingActions()}
            onClick={handleOnClick()}
          >
            <div style={{display: 'flex', justifyContent: 'centered', paddingBottom: "25px"}}>
              <div style={{display: 'flex', flexDirection: 'column', maxWidth: '300px'}}>
                <div>
                  <Link href={`${postItem.link}`} target='cafe-society'>{postItem.title}</Link>
                </div>
                <div style={{display: 'block', width: '100%', overflow: 'wrap'}}>
                  {postItem.description}
                </div>
              </div>
            </div>
          </SwipeableListItem>
        </SwipeableList>
      </div>
  );
};

export default Post;

// const ItemContent = styled.div`
// display: flex;
// align-items: center;
// justify-content: center;
// width: 100%;
// user-select: none
// `;

const ActionContent = styled.div`
height: 100%;
display: flex;
align-items: center;
font-size: 12px;
user-select: none;
padding-right: 10px;
padding-left: 10px;
`;

// const ItemRow = styled.div`
// width: 100%;
// display: flex;
// `;

// const ItemColumn = styled.div`
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// `;

const ItemColumnCentered = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`;