import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import {cleanTags, cleanPostItem, removePunctuation} from '../utils'
import { ClassifierContext } from './Classifier'
const bayes = require('classificator');

import {
  ThumbDown,
  ThumbUp
} from '@mui/icons-material'

import 'react-swipeable-list/dist/styles.css';
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
  
import { 
  PostContext
} from './Posts';

import {
  CategoryContext
} from './Category'

const Post: FunctionComponent = () => {
  const classifierContext = useContext(ClassifierContext);
  const classifier = structuredClone(classifierContext);
  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
  const categoryContext = useContext(CategoryContext)
  const category = `${categoryContext}`
  const id = `${postItem.link}`

  const handleAccept = () => () => {
    console.log('[Handle ACCEPT]');
  };

  const handleDelete = () => () => {
    console.log('[Handle DELETE]');
  };

  const handleOnClick = () => () => {
    console.log('[handle on click]', id);
  };

  const mlText = removePunctuation(`${postItem.title} ${postItem.description}`)

  let classifierForCategory = bayes()

  try {
    if (classifier !== {}) {
      classifierForCategory = structuredClone(classifier) ? bayes.fromJson(JSON.stringify(classifier)) : bayes()
    }
  } catch (err) {
    // console.log(err)
  }

  let predictionNotGood = -.001
  let predictionGood = -.001

  try {
    if (classifier !== undefined) {
      const prediction = classifierForCategory.categorize(`${mlText}`);
      predictionNotGood = parseFloat(prediction.likelihoods ?.filter((likelihood: {proba: string}) => likelihood.proba !== `NaN`).find(
        (likelihood: any) => likelihood && likelihood.category === 'notgood'
      )?.proba || 0.0)
  
      predictionGood = parseFloat(prediction.likelihoods ?.filter((likelihood: {proba: string}) => likelihood.proba !== `NaN`).find(
        (likelihood: any) => likelihood && likelihood.category === 'good'
      )?.proba || 0.0)
    }
  } catch(err) {
    // console.log(err)
  }

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={handleAccept()} destructive={true}>
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
      <SwipeAction destructive={true} onClick={handleDelete()}>
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
                      primary={<Link href={`${postItem.link}`}>{postItem.title}</Link>}
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