import React, { FunctionComponent, useContext } from 'react';
import { ParsedFeedContentContext } from './Feeds';

const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext)
  
  return (
    <div>
      {
        parsedFeedContent.items.map((post: {
          title: string
        }) => <div>{`${post.title}`}</div>)
      }
    </div>
  )
};

export default PostsDisplay;
