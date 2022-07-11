import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
//import SurpressProcessedPosts from './SurpressProcessedPosts';
import SurpressProcessedPosts from './SurpressProcessedPosts'
import {
  Link, 
  Divider, 
  Typography
} from '@mui/material';
import {cleanTags, removeTrackingGarbage} from '../utils'

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
          const feedDescription = cleanTags(structuredClone({...feedContentEntry[1] as object}).description["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).description}`)
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
                  title: string,
                  link: string,
                  description: string
                }) => {

                  const cleanPostItem = {
                    title: cleanTags(structuredClone({...postItem as object}).title["$text"]  || `${structuredClone({...postItem as object}).title}`),
                    description: removeTrackingGarbage(cleanTags(structuredClone({...postItem as object}).description["$text"]  || `${structuredClone({...postItem as object}).description}`)),
                    link: structuredClone({...postItem as object}).link["$text"]  || `${structuredClone({...postItem as object}).link}`

                  }

                  return (
                    <PostContext.Provider
                      value={cleanPostItem}
                      key={JSON.stringify(cleanPostItem)}
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

