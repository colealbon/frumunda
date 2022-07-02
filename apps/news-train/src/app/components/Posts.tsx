import React, { FunctionComponent, useContext } from 'react';
import { ParsedFeedContentContext } from './Feeds';

const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext)
  
  return (
    <>
      {
        parsedFeedContent.items.map((post: {
          title: string
        }) => <>{`${post.title}`}<br/></>)
      }
    </>
  )
};

export default PostsDisplay;
