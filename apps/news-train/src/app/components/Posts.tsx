import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
//import SurpressProcessedPosts from './SurpressProcessedPosts';
import SurpressProcessedPosts from './SurpressProcessedPosts'
import { htmlToText } from 'html-to-text';
import {
  Link, 
  Divider, 
  Typography
} from '@mui/material';
import {cleanTags} from '../utils'

export const PostContext = createContext({});


const Posts: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  return (
    <>
      {
        Object.entries(parsedFeedContent).map((feedContentEntry) => {
          const feedLink: string = feedContentEntry[0]
          const feedTitleText: string = cleanTags(structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`)
          const feedDescription = cleanTags(htmlToText(structuredClone({...feedContentEntry[1] as object}).description["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).description}`,     {
            ignoreHref:
              true,
            ignoreImage:
              true,
          }))
          const postItems = structuredClone({...feedContentEntry[1] as object}).items
          
          return (
            <div
              key={feedLink}
              style={{ 
                width: "90%"
              }}
            > 
              <Typography variant="h3">
                <Link href={`${feedLink}`} component="button">
                  {`${feedTitleText}`}
                </Link>
              </Typography>
              <Typography variant="caption">
                {` ${feedDescription}`}
              </Typography>
              <Divider />
              {
                postItems.map((postItem: {
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
            </div>
            
          )
        })
      }
    </>
  )
}

export default Posts;

