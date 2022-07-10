import React, { FunctionComponent, useContext, createContext } from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
//import SurpressProcessedPosts from './SurpressProcessedPosts';
import { htmlToText } from 'html-to-text';
import {
  Link, 
  Divider, 
  Typography
} from '@mui/material';

export const PostContext = createContext({});


const Posts: FunctionComponent = () => {
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);
  return (
    <>
    {Object.entries(parsedFeedContent).map((feedContentEntry) => {
    const feedLink: string = feedContentEntry[0]
    const feedTitleText: string = structuredClone({...feedContentEntry[1] as object}).feedLabel || structuredClone({...feedContentEntry[1] as object}).title["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).title}`
    const feedDescription = structuredClone({...feedContentEntry[1] as object}).description["$text"]  || `${structuredClone({...feedContentEntry[1] as object}).description}`
    
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
      </div>
    )
  })}
  </>)
}

export default Posts;


  //const feedTitleText = `${Object.assign({...parsedFeedContent[1] as object}).feedLabel} `.concat(`${Object.entries(Object.assign({...parsedFeedContent[1] as object} || {title: ''}).title)
  // .filter(titleEntry => {
  //   return titleEntry[0] === "$text"
  // })
  // .map(titleEntry => htmlToText(
  //     `${titleEntry[1]}`,
  //     {
  //       ignoreHref:
  //         true,
  //       ignoreImage:
  //         true,
  //     }
  //   )
  //   .replace(
  //     '&mdash;',
  //     ''
  //   ))

  // .concat(Object.assign({...parsedFeedContent[1] as object}).title)
  // .find(() => true)}`)

  // const feedLink = Object.entries(Object.assign({...parsedFeedContent[1] as object} || {link: ''}).link)
  //   .filter(linkEntry => {
  //     return linkEntry[0] === "$text"
  //   })
  //   .map(linkEntry => linkEntry[1])
  //   .concat(Object.assign({...parsedFeedContent[1] as object}).link)
  //   .find(() => true)

  //   const feedDescription = Object.entries(Object.assign({...parsedFeedContent[1] as object} || {link: ''}).description)
  //   .filter(descriptionEntry => {
  //     return descriptionEntry[0] === "$text"
  //   })
  //   .map(descriptionEntry => htmlToText(`${descriptionEntry[1]}`,
  //       {
  //         ignoreHref:
  //           true,
  //         ignoreImage:
  //           true,
  //       }
  //     )
  //     .replace(
  //       '&mdash;',
  //       ''
  //     ))
  //   .concat(Object.assign({...parsedFeedContent[1] as object}).description)
  //   .find(() => true)


//     <Typography variant="h3">
  //       <Tooltip title={`${feedDescription}`}>

  //       </Tooltip>
  //     </Typography>
  //     <Divider />
  //     {
  //       Object.values(parsedFeedContent as object).find(() => true).items.map((postItem: {
  //         title: string
  //       }) => {
  //         return (
  //           <PostContext.Provider
  //             value={postItem}
  //             key={JSON.stringify(postItem)}
  //           >
  //               <Post />
  //           </PostContext.Provider>
  //         )
  //       })
  //     }