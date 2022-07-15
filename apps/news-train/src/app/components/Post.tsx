import { FunctionComponent, useContext } from 'react';
import {
  LeadingActions,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from 'react-swipeable-list';
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

  const handleSwipeStart = () => {
    console.log('swipe start')
    // setSwipeAction('Swipe started');
    // setTriggeredItemAction('None');
  };

  const handleSwipeEnd = () => {
    console.log('swipe end')
    // setSwipeAction('Swipe ended');
    // setSwipeProgress();
  };

  const handleAccept = id => () => {
    console.log('[Handle ACCEPT]', id);
    // setTriggeredItemAction(`[Handle ACCEPT] - ${id}`);
    // setStatus(id, 'accepted');
  };

  const handleDelete = id => () => {
    console.log('[Handle DELETE]', id);
    // setTriggeredItemAction(`[Handle DELETE] - ${id}`);
    // setPeople(people.filter(person => person.id !== id));
  };

  const handleOnClick = id => () => {
    console.log('[handle on click]', id);
  };


  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={handleAccept()}>
          Accept
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={handleDelete()}>
            Delete
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableListItem 
    leadingActions={leadingActions()}
    trailingActions={trailingActions()}
    onSwipeEnd={handleSwipeEnd}
    // onSwipeProgress={setSwipeProgress}
    onSwipeStart={handleSwipeStart}
    onClick={handleOnClick(postItem.link)}
    key={postItem.link}
    >
      <ListItem key={`postitem-${postItem.link}`}>
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
    </SwipeableListItem>
  );
};

export default Post;
