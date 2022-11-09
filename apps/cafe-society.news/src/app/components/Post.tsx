import { FunctionComponent, useContext, ReactNode } from 'react';
import useSWR, { mutate } from 'swr';
import styled from 'styled-components';
import { removePunctuation, shortUrl, hashStr } from '../utils';
import { PostContext } from './Posts';
import { ParsedFeedContentContext } from './Feed';
import { CategoryContext } from './CheckedCategory';
import { useStorage } from '../react-hooks/useStorage';
import { ThumbDown, ThumbUp } from '@mui/icons-material';
import { predictionType } from '../types'
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
const bayes = require('classificator');

const Post: FunctionComponent = () => {
  const { persist, fetchFile } = useStorage();
  const postContext = useContext(PostContext);
  const postItem = Object.assign(postContext);
  const id = `${postItem.link}`;
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = {...parsedFeedContentContext};

  const keyForFeed = Object.keys(parsedFeedContent)[0];
  const processedFilenameForFeed = hashStr(`processed_${category}_${shortUrl(keyForFeed)}`);
  const mlText = removePunctuation(
    `${postItem.title} ${postItem.description} ${postItem.summary}`
  );

  let classifier = bayes();
  const { data: classifierdata } = useSWR(`classifier_${category}`.replace(/_$/, ''), () =>
    fetchFile(`classifier_${category}`, JSON.parse(classifier.toJson()))
  );
  const defaultProcessedPosts = JSON.parse(
    `{"${processedFilenameForFeed}":[]}`
  );
  const { data: processedPostsdata } = useSWR(processedFilenameForFeed, () =>
    fetchFile(processedFilenameForFeed, defaultProcessedPosts)
  );
  const processedPosts = Object.values({ ...(processedPostsdata as object) })
    .flat()
    .slice();

  try {
    if (classifierdata) {
      classifier = bayes.fromJson(JSON.stringify(classifierdata));
    }
  } catch (error) {
    console.log(error);
  }

  const handleTrain = (label: string) => {
    classifier.learn(`${mlText}`, label);
    const newClassifier = JSON.parse(classifier.toJson());
    const filenameForClassifier = `classifier_${category}`.replace(/_$/, '');
    const newProcessedPosts: unknown[] = Array.from(
      new Set([...processedPosts, `${mlText}`.replace('undefined', '')])
    ).filter((removeEmpty) => !!removeEmpty);
    const payloadProcessedPosts = JSON.parse(
      `{"${processedFilenameForFeed}": ${JSON.stringify(newProcessedPosts)}}`
    );

    mutate(
      processedFilenameForFeed,
      persist(processedFilenameForFeed, payloadProcessedPosts),
      {
        optimisticData: payloadProcessedPosts,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false,
      }
    );

    mutate(
      filenameForClassifier,
      persist(filenameForClassifier, newClassifier),
      {
        optimisticData: newClassifier,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false,
      }
    );
  };

  const handleOnClick = () => () => {
    // console.log('[handle on click]', id);
  };


  const predict = (
    mlText: string, 
    category: string,
    classifier: {
      categorize: (mlText: string) => {likelihoods: {proba: string, category: string}[]},
      likelihoods?: {proba?: string, category?: string}[]
    }) => {
      try {
        return parseFloat(
          classifier.categorize(`${mlText}`).likelihoods
            ?.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (likelihood: any) => likelihood?.proba.toString() !== `NaN`
            )
            .find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (likelihood: any) =>
                likelihood?.category.toString() === category
            )?.proba || '0.0'
        ) || -0.001;
      } catch (error) {
        return -0.001
      }
    }

  const swipeActions = (classifierCategory: string, iconComponent: ReactNode) => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => handleTrain(category)}>
        <ActionContent>
          <ItemColumnCentered>
            {`${category}`}
            <span className="icon">
              {iconComponent}
            </span>
            {`${Math.round(predict( mlText, classifierCategory, classifier) * 100)}%`}
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
    </TrailingActions>
  );

  //{`${Math.round(parseFloat(predict( mlText, 'notGood', classifier))) * 100)}%`}

  return (
        <div
          style={{ width: '100%'}}
          className="basic-swipeable-list__container"
          key={postItem.link}
        >
          <SwipeableList 
            fullSwipe={true} 
            threshold={0.5}
            type={ListType.IOS} 
            destructiveCallbackDelay={100} 
          >
            <SwipeableListItem
              key={id}
              leadingActions={swipeActions('good', <ThumbUp />)}
              trailingActions={swipeActions('notgood', <ThumbDown />)}
              onClick={handleOnClick()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'centered',
                  paddingBottom: '25px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '300px',
                  }}
                >
                  <div>
                    <Link href={`${postItem.link}`} target="cafe-society">
                      {postItem.title}
                    </Link>
                  </div>
                  <div
                    style={{ display: 'block', width: '100%', overflow: 'wrap' }}
                  >
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

const ActionContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 12px;
  user-select: none;
  padding-right: 10px;
  padding-left: 10px;
`;

const ItemColumnCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
