import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
import SurpressProcessedPosts from './SurpressProcessedPosts';
export const PostContext = createContext({});

const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  console.log(parsedFeedContent)
  return (
    <>
      {
        Object.values(parsedFeedContent as object).find(() => true).items.map((postItem: {
          title: string
        }) => {
          return (
            <PostContext.Provider
              value={postItem}
              key={JSON.stringify(postItem)}
            >
              <SurpressProcessedPosts>
                <Post />
              </SurpressProcessedPosts>
            </PostContext.Provider>
          )
        })
      }
    </>
  )
};

export default PostsDisplay;
