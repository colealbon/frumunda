import { FunctionComponent, useContext } from 'react';

import 'react-swipeable-list/dist/styles.css';
import {
    Link,
    ListItem,
    ListItemText,
    Typography
  } from '@mui/material';
  
import { 
  PostContext
} from './Posts';

const Post: FunctionComponent = () => {
  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)

  return (
      <ListItem key={postItem.link}>
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
      </ListItem>
  );
};

export default Post;
