import { FunctionComponent, useContext, createContext, Fragment } from 'react';
import { ParsedFeedContentContext } from './Feed';
import useSWR from 'swr';
import Post from './Post';
import { 
  Card,
  CardContent,
  Link, 
  Typography, 
  Divider, 
  Grid
} from '@mui/material';

import {feedValueType} from '../types'
import { settingsType, useSettings } from '../react-hooks/useSettings';
import { useStacks } from '../react-hooks/useStacks';
import defaultFeeds from '../react-hooks/defaultFeeds.json';
import { CategoryContext } from './CheckedCategory';

import { 
  shortUrl, 
  cleanPostItem, 
  removePunctuation, 
  hashStr 
} from '../utils';

import {
  cleanPostItemType
} from '../types';

import stringSimilarity from 'string-similarity';
import MarkFeedProcessedButton from './MarkFeedProcessedButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator');

export const PostContext = createContext({});
const Posts: FunctionComponent = () => {
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = {...parsedFeedContentContext};
  const keyForFeed = Object.keys(parsedFeedContent)[0];
  const processedFilenameForFeed = hashStr(`processed_${category}_${shortUrl(keyForFeed)}`);
  const { settings } = useSettings();
  const {
    hideProcessedPosts,
    disableMachineLearning,
    mlThresholdDocuments,
    mlThresholdConfidence
  } = settings as settingsType;

  const { fetchFile, fetchFileLocal } = useStacks();

  const { data: feedsdata } = useSWR(
    'feeds',
    fetchFileLocal('feeds', defaultFeeds)
  );
  const feeds = { ...(feedsdata as object) };
  const { data: classifierdata } = useSWR(
    `classifier_${category}`.replace(/_$/, '')
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

  let classifier = bayes();

  try {
    if (classifierdata) {
      classifier = bayes.fromJson(JSON.stringify(classifierdata));
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <div id="back-to-top-anchor" />
      {Object.entries(parsedFeedContent).map((feedContentEntry: [string, feedValueType | unknown])   => {
        const feedLink = feedContentEntry[0];
        const feedValue  = feedContentEntry[1] as feedValueType
        const feedTitle: string = feedValue['title']
        const feedDescription: string = feedValue['description']

        const feedLabel = Object.entries(feeds)
          .filter((feedEntry) => feedEntry[0] === feedLink)
          .map((feedEntry) => Object.entries(feedEntry[1] as object))
          .flat()
          .filter((feedValEntry: unknown[]) => feedValEntry[0] === 'label')
          .map((feedLabelEntry) => feedLabelEntry[1])
          .find(() => true);

        const unprocessedCleanPostItems = feedValue
          ['items'].filter((noEmpties: object) => !!noEmpties)
          .filter((noEmpties) => !!noEmpties['link'])
          .map((postItem: cleanPostItemType) => cleanPostItem(postItem))
          .filter((postItem) => {
            if (!hideProcessedPosts) {
              return true;
            }
            // surpress previously processed posts
            const mlText = removePunctuation(`${postItem['title']} ${postItem['description']}`);
            return !processedPosts.find((processedMLText) => {
              const similarity = stringSimilarity.compareTwoStrings(
                `${removePunctuation(`${processedMLText}`)}`,
                mlText
              );
              return similarity > 0.8;
            });
          })
          .filter(postItem => {
            // surpress bayes thumbs down predictions
            const mlText = removePunctuation(
              `${postItem['title']} ${postItem['description']}`
            );
            if (disableMachineLearning.checked === true) {
              return true;
            }
            if (
              parseInt(classifier.totalDocuments) < parseInt(mlThresholdDocuments.value)
            ) {
              return true;
            }
            try {
              const prediction = classifier.categorize(`${mlText}`);
              const surpress =
                parseFloat(
                  prediction.likelihoods
                    ?.filter(
                      (likelihood: { proba: string }) =>
                        likelihood.proba !== `NaN`
                    )
                    .find(
                      (likelihood: { category: string }) =>
                        likelihood &&
                        likelihood['category'] === 'notgood'
                    )?.proba || 0.0
                ) > parseFloat(mlThresholdConfidence.value)
              return !surpress;
            } catch (error) {
              return true;
            }
          });

        if (unprocessedCleanPostItems.length === 0) {
          return (
            <div key='singledingleplacehold'>
            </div>
          );
        }
        return (

            <Fragment key={feedLink}>
              <Divider />
              <Typography
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Link href={`${feedLink}`} target="_blank" style={{textDecoration: 'none'}}>
                  {`${feedLabel || feedTitle || feedLink}`}
                </Link>
                <Typography
                  variant="caption"
                >
                  {feedDescription}
                </Typography>
              </Typography>
              <Typography variant="caption">{` (${
                unprocessedCleanPostItems.length
              } of ${
                feedValue.items.length
              } posts remaining)`}</Typography>
              <Divider />
              <br />
                <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{minWidth: '100%'}} >
                  {unprocessedCleanPostItems.map(cleanPostItem => {
                    return (
                      <Grid item 
                      xs={3} 
                      sm={4} 
                      md={4} 
                      key={JSON.stringify(cleanPostItem)}
                      style={{justifyContent: 'center', alignItems: 'center', minWidth:'300px'}}
                      >
                        <PostContext.Provider
                          value={cleanPostItem}
                          key={`postitem-swipeable-list-${
                            cleanPostItem['link']
                          }`}
                        >
                          <Card style={{minWidth:'100%'}}>
                            <CardContent>
                              <Post key={JSON.stringify(cleanPostItem)} />
                            </CardContent>
                          </Card>
                        </PostContext.Provider>
                      </Grid>
                    );
                  })}
                </Grid>

              <MarkFeedProcessedButton />
            </Fragment>

        );
      })}
    </>
  );
};
export default Posts;
