import React, { FunctionComponent, useContext, createContext, Fragment } from 'react';
import {
    Box,
    Card,
    CardContent,
    Link,
    ListItem,
    ListItemText,
    Typography,
    Divider
  } from '@mui/material';
//   import htmlToText from 'html-to-text';
import { 
  PostContext
  //, FeedContext 
} from './Posts';
import {CategoryContext} from './Category'

import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'

// import {
//   Box,
//   Link,
//   ListItem,
//   ListItemText,
//   Typography,
// } from '@material-ui/core';
// import htmlToText from 'html-to-text';
// import { CategoryContext } from './Categories';
const Post: FunctionComponent = () => {
  const { selectedCategoryIndex } = useSelectedCategoryIndex();
  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;
//   const feedContext = useContext(FeedContext)
//   const feed = Object.assign(feedContext)[0]



// const postTitle: string = removePunctuation(convert(
//     postItem.title
//   ))

//   const postDescription = removeTrackingGarbage(cleanTags(convert(postItem.description)))

  return (
    <Card variant="outlined" key={`item-${category}-${
        JSON.stringify(
          postItem
        ) || ''
      }`}>
      <CardContent>
        <ListItem
          className="post-item-anchor"
        >
          <ListItemText
            primary={
              <Link
                key={postItem.link}

                href={new URL(
                  `${postItem.link}`
                ).toString()}
                target="news-train"
              >
                  <Typography>
                    {postItem.title}
                  </Typography>
              </Link>
            }
            secondary={postItem.description}
          />
          <Divider />
        </ListItem>
      </CardContent>
   </Card>
  );
};

export default Post;
