import React, { FunctionComponent , useContext, ReactNode} from 'react';
import { PostContext } from './Posts';
import { htmlToText } from 'html-to-text';
// import { useSettings } from '../custom-hooks/useSettings'
import { ParsedFeedContentContext } from './Feed'
import { removePunctuation, removeTrackingGarbage } from '../utils.js'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'
import stringSimilarity from 'string-similarity'

type Props = {children: ReactNode}
const SurpressProcessedPosts: FunctionComponent<Props> = ({children}: Props) => {
  console.log('surpressProcessedPosts')
  // const {settings} = useSettings()
  // const {hideProcessedPosts} = JSON.parse(JSON.stringify(settings))
  const postContext = useContext(PostContext)
  const post = Object.assign(postContext)
  const processedPosts = useProcessedPosts()
  const parsedFeedContentContext = useContext(ParsedFeedContentContext);
  const parsedFeedContent = structuredClone(parsedFeedContentContext);


  // if (hideProcessedPosts.checked === false) {
  //   return (<>{children}</>)
  // }

    const theTitle = `${post.title}`
    const theDescription = `${post.description}`
    const descriptionText = htmlToText(theDescription, {
      ignoreHref: true,
      ignoreImage: true,
    });

  const mlText = removeTrackingGarbage(removePunctuation(`${theTitle} ${descriptionText}`))

  // console.log(processedPosts)
  // console.log(parsedFeedContent)

  const processedPostsForFeed = [Object.entries(processedPosts)
    .filter((feedEntry) => feedEntry[0] === 'feedLink')
    .map(feedEntry => feedEntry[1])]
    .flat(Infinity)
    .map(postEntry => removePunctuation(removeTrackingGarbage(postEntry)))
  
  if (mlText === '') {
    return (<span></span>)
  }


  return (
    processedPostsForFeed.find((postItem: string) => {
      const similarity = stringSimilarity.compareTwoStrings(`${removeTrackingGarbage(removePunctuation(postItem))}`, mlText)
      console.log(similarity)
      return similarity > .85
    }) ? <></> : <>{children}</>
  )
};

export default SurpressProcessedPosts;
