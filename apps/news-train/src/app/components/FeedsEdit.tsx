import React, { FunctionComponent, Suspense } from 'react';
import { useFeeds } from '../react-hooks/useFeeds'

import FeedsAdd from './FeedsAdd';
import FeedsReset from './FeedsReset';

import FeedToggle from './FeedToggle';
import FeedDelete from './FeedDelete';

const FeedsEdit: FunctionComponent = () => {
  const { feeds } = useFeeds()

  return (
    <>
      <FeedsAdd/>
      <div /> 
      <FeedsReset />
      <div />
      {Object.keys(JSON.parse(JSON.stringify(feeds))).map(feed => {
        return (
          <div key={`feed-edit-${feed}`}>
            <FeedToggle text={feed} />
            <FeedDelete text={feed} />
          </div>
        );
      })}
    </>
  )
};

export default FeedsEdit;