import { FunctionComponent, useContext, useCallback } from 'react';
import useSWR from 'swr'
import styled from 'styled-components';
import { removePunctuation, shortUrl } from '../utils'
import { PostContext } from './Posts';
import { ParsedFeedContentContext } from './Feed'
import { useStacks } from '../react-hooks/useStacks'

import {
  ThumbDown,
  ThumbUp
} from '@mui/icons-material'
import {
    Link,
    ListItem,
    ListItemText
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
  const { persistFile } = useStacks()

  // const { processedPosts, persistProcessedPosts } = useProcessedPosts()
  // const { classifiers, persistClassifiers } = useClassifiers()

  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
  // const categoryContext = useContext(CategoryContext)
  // const category = `${categoryContext}`
  const id = `${postItem.link}`

  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const keyForFeed = Object.keys(parsedFeedContent)[0]
  const processedFilenameForFeed = `processed_${shortUrl(keyForFeed)}`

  const mlText = removePunctuation(`${postItem.title} ${postItem.description} ${postItem.summary}`)

  const {data: category} = useSWR('category')
  const {data: classifierdata} = useSWR(`classifier_${category}`)
  const {data: processedPosts} = useSWR(processedFilenameForFeed)

  let classifier = bayes()

  try {
    if (classifierdata) {
      classifier = bayes.fromJson(JSON.stringify(classifierdata))
    } 
  } catch (error) {
    console.log(error)
  }

  const handleTrain = useCallback( (label: string) => {
    classifier.learn(`${mlText}`, label);
    persistFile(`classifier_${category}`, JSON.parse(classifier.toJson()))
    const newProcessedPosts: string[] = Array.from(new Set([...processedPosts].concat(mlText)))
    persistFile(processedFilenameForFeed, newProcessedPosts)

  }, [category, classifier, mlText, persistFile, processedFilenameForFeed, processedPosts]);
  const handleOnClick = () => () => {
    console.log('[handle on click]', id);
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
    <ListItem key={postItem.link}>
      <div className="basic-swipeable-list__container">
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
            <ItemContent>
              <ItemRow>
                <ItemColumn>
                  <ListItemText
                    primary={<Link href={`${postItem.link} target='cafe-society`}>{postItem.title}</Link>}
                    secondary={`${postItem.description}`}
                  />
                </ItemColumn>
              </ItemRow>
            </ItemContent>
          </SwipeableListItem>
        </SwipeableList>
      </div>
    </ListItem>
  );
};

export default Post;

const ItemContent = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
user-select: none;
`;

const ActionContent = styled.div`
height: 100%;
display: flex;
align-items: center;
padding: 8px;
font-size: 12px;
box-sizing: border-box;
user-select: none;
`;


const ItemRow = styled.div`
width: 100%;
display: flex;
padding: 0 8px;
`;

const ItemColumn = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`;

const ItemColumnCentered = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`;