import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
import SurpressProcessedPosts from './SurpressProcessedPosts';
import { htmlToText } from 'html-to-text';
import {
  Link, 
  Tooltip, 
  Divider, 
  Typography
} from '@mui/material';

export const PostContext = createContext({});


const PostsDisplay: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);

  const feedTitleText = `${Object.assign({...parsedFeedContent[1] as object}).feedLabel} `.concat(`${Object.entries(Object.assign({...parsedFeedContent[1] as object} || {title: ''}).title)
  .filter(titleEntry => {
    return titleEntry[0] === "$text"
  })
  .map(titleEntry => htmlToText(
      `${titleEntry[1]}`,
      {
        ignoreHref:
          true,
        ignoreImage:
          true,
      }
    )
    .replace(
      '&mdash;',
      ''
    ))

  .concat(Object.assign({...parsedFeedContent[1] as object}).title)
  .find(() => true)}`)

  const feedLink = Object.entries(Object.assign({...parsedFeedContent[1] as object} || {link: ''}).link)
    .filter(linkEntry => {
      return linkEntry[0] === "$text"
    })
    .map(linkEntry => linkEntry[1])
    .concat(Object.assign({...parsedFeedContent[1] as object}).link)
    .find(() => true)

    const feedDescription = Object.entries(Object.assign({...parsedFeedContent[1] as object} || {link: ''}).description)
    .filter(descriptionEntry => {
      return descriptionEntry[0] === "$text"
    })
    .map(descriptionEntry => htmlToText(`${descriptionEntry[1]}`,
        {
          ignoreHref:
            true,
          ignoreImage:
            true,
        }
      )
      .replace(
        '&mdash;',
        ''
      ))
    .concat(Object.assign({...parsedFeedContent[1] as object}).description)
    .find(() => true)
  return (
    <div
      style={{ 
        width: "90%"
      }}
    >
      <Typography variant="h3">
        <Tooltip title={`${feedDescription}`}>
          <Link href={`${feedLink}`}>
            {feedTitleText}
          </Link>
        </Tooltip>
      </Typography>
      <Divider />
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
        <Divider />
    </div>
  )
};

export default PostsDisplay;
