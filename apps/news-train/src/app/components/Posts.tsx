import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
export const PostContext = createContext({});

const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);

  return (
    <>
      {
        parsedFeedContent.items.map((postItem: {
          title: string
        }) => {
          return (
            <PostContext.Provider
              value={postItem}
              key={JSON.stringify(postItem)}
            >
              <Post />
            </PostContext.Provider>
          )
        })
      }
    </>
  )
};

export default PostsDisplay;
