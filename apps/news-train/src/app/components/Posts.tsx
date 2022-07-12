import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'
import {
  Link, 
  Divider, 
  Typography
} from '@mui/material';
import {cleanTags, cleanPostItem, removePunctuation} from '../utils'
import stringSimilarity from 'string-similarity'
import MarkFeedProcessedButton from './MarkFeedProcessedButton'

export type cleanPostItemType = {
  title: string,
  link: string,
  description: string
}

export const PostContext = createContext({});

const Posts: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  const {processedPosts} = useProcessedPosts()

  return (
    <>
      {
        Object.entries(parsedFeedContent).map((feedContentEntry) => {
          const feedLink: string = feedContentEntry[0]
          const feedTitleText: string = cleanTags(structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`)
          const feedDescription = cleanTags(structuredClone({...feedContentEntry[1] as object}).description["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).description}`)
          const processedPostsForFeed = [Object.entries(processedPosts as object)
            .filter((feedEntry) => feedEntry[0] === feedLink)
            .map(feedEntry => feedEntry[1])]
            .flat(Infinity)

          const unprocessedCleanPostItems = structuredClone({...feedContentEntry[1] as object}).items.map((postItem: cleanPostItemType) => cleanPostItem(postItem))
            .filter((postItem: cleanPostItemType) => {
              const mlText = removePunctuation(`${postItem.title} ${postItem.description}`)
              return !processedPostsForFeed.find((postItem: string) => {
                const similarity = stringSimilarity.compareTwoStrings(`${removePunctuation(postItem)}`, mlText)
                return similarity > .82
              })
            })

          if (unprocessedCleanPostItems.length === 0) {
            return <span key='empty'></span>
          }

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
              <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} remaining)`}</Typography>
              <Divider />
              {
                unprocessedCleanPostItems.map((cleanPostItem: cleanPostItemType) => {
                  return (
                    <PostContext.Provider
                      value={cleanPostItem}
                      key={JSON.stringify(cleanPostItem)}
                    >
                      <Post />
                    </PostContext.Provider>
                  )
                })
              }
              <MarkFeedProcessedButton />
            </div>
          )
        })
      }
    </>
  )
}

export default Posts;

