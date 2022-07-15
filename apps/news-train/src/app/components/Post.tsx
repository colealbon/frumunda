import { FunctionComponent, useContext, useState } from 'react';
import styled from 'styled-components';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

import 'react-swipeable-list/dist/styles.css';
import {
    Link,
    ListItem,
    ListItemText,
    Typography
  } from '@mui/material';

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from 'react-swipeable-list';
  
import { 
  PostContext
} from './Posts';

const Post: FunctionComponent = () => {
  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
  const id = `${postItem.link}`

  // const [fullSwipe, setFullSwipe] = useState(false);
  const [threshold, setThreshold] = useState(0.5);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeAction, setSwipeAction] = useState();
  const [triggeredItemAction, setTriggeredItemAction] = useState('None');

  const handleSwipeStart = () => {
    setSwipeAction('Swipe started');
    setTriggeredItemAction('None');
  };

  const handleSwipeEnd = () => {
    setSwipeAction('Swipe ended');
    setSwipeProgress(0);
  };

  const handleAccept = () => () => {
    console.log('[Handle ACCEPT]');
    setTriggeredItemAction(`[Handle ACCEPT]`);
    // setStatus(id, 'accepted');
  };

  const handleDelete = () => () => {
    console.log('[Handle DELETE]');
    setTriggeredItemAction(`[Handle DELETE]`);
  };

  const handleOnClick = () => () => {
    console.log('[handle on click]', id);
  };

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={handleAccept()} destructive={true}>
        <ActionContent>
          Accept
        </ActionContent>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={handleDelete()}>
        <ActionContent>
          <ItemColumnCentered>
            <span className="icon">
              <DeleteOutlined />
            </span>
            Delete
          </ItemColumnCentered>
        </ActionContent>
      </SwipeAction>
    </TrailingActions>
  );


  return (
      <ListItem key={postItem.link}>
        <div className="basic-swipeable-list__container">
          <SwipeableList
            fullSwipe={true}
            style={{ backgroundColor: '#555878' }}
            threshold={threshold}
            type={ListType.IOS}
          >
              <SwipeableListItem
                key={id}
                leadingActions={leadingActions()}
                trailingActions={trailingActions()}
                onSwipeEnd={handleSwipeEnd}
                onSwipeProgress={setSwipeProgress}
                onSwipeStart={handleSwipeStart}
                onClick={handleOnClick()}
              >
                <ItemContent>
                  <ItemRow>
                    <ItemColumn>
                      <ItemNameLine>{postItem.title}</ItemNameLine>
                      <ItemInfoLine>
                        {postItem.description}
                      </ItemInfoLine>
                    </ItemColumn>
                  </ItemRow>
                </ItemContent>
              </SwipeableListItem>
          </SwipeableList>
        </div>
      </ListItem>
  );
};



export default Post;

const ItemContent = styled.div`
height: 64px;
display: flex;
align-items: center;
justify-content: center;
width: 100%;
background-color: #555878;
border-style: solid;
border-color: #393a52;
border-width: 12px;
border-top-width: 6px;
border-bottom-width: 6px;
color: #eee;
user-select: none;
`;

const ActionContent = styled.div`
height: 100%;
display: flex;
align-items: center;
padding: 8px;
font-size: 12px;
font-weight: 500;
box-sizing: border-box;
color: #eee;
user-select: none;
`;

const Avatar = styled.img`
width: 44px;
height: 44px;
border-radius: 50%;
margin-right: 8px;
user-drag: none;
user-select: none;
`;

const ItemRow = styled.div`
width: 100%;
display: flex;
padding: 0 8px;
`;

const ItemColumn = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`;

const ItemColumnCentered = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`;

const ItemNameLine = styled.span`
font-weight: 500;
`;

const ItemInfoLine = styled.span`
font-size: 14px;
`;


// import {
//   LeadingActions,
//   SwipeableList,
//   SwipeableListItem,
//   SwipeAction,
//   TrailingActions,
//   Type as ListType,
// } from 'react-swipeable-list';
// import 'react-swipeable-list/dist/styles.css';

// import {
//   ActionContent,
//   Avatar,
//   ItemColumn,
//   ItemColumnCentered,
//   ItemContent,
//   ItemInfoLine,
//   ItemNameLine,
//   ItemRow,
// } from '../styledComponents';
// import { colors } from '../data.js';
// import { DeleteIcon } from '../../images/icons';

// import './WithOneAction.css';

// const WithOneAction = ({
//   people,
//   fullSwipe,
//   setStatus,
//   setPeople,
//   threshold,
//   setThreshold,
//   setSwipeAction,
//   setSwipeProgress,
//   setTriggeredItemAction,
// }) => {
//   React.useEffect(() => {
//     setThreshold(0.5);
//   }, [setThreshold]);

//   const handleSwipeStart = () => {
//     setSwipeAction('Swipe started');
//     setTriggeredItemAction('None');
//   };

//   const handleSwipeEnd = () => {
//     setSwipeAction('Swipe ended');
//     setSwipeProgress();
//   };

//   const handleAccept = id => () => {
//     console.log('[Handle ACCEPT]', id);
//     setTriggeredItemAction(`[Handle ACCEPT] - ${id}`);
//     setStatus(id, 'accepted');
//   };

//   const handleDelete = id => () => {
//     console.log('[Handle DELETE]', id);
//     setTriggeredItemAction(`[Handle DELETE] - ${id}`);
//     setPeople(people.filter(person => person.id !== id));
//   };

//   const handleOnClick = id => () => {
//     console.log('[handle on click]', id);
//   };

//   const leadingActions = ({ id }) => (
//     <LeadingActions>
//       <SwipeAction onClick={handleAccept(id)}>
//         <ActionContent style={{ backgroundColor: colors.accepted }}>
//           Accept
//         </ActionContent>
//       </SwipeAction>
//     </LeadingActions>
//   );

//   const trailingActions = ({ id }) => (
//     <TrailingActions>
//       <SwipeAction destructive={true} onClick={handleDelete(id)}>
//         <ActionContent style={{ backgroundColor: colors.deleted }}>
//           <ItemColumnCentered>
//             <span className="icon">
//               <DeleteIcon />
//             </span>
//             Delete
//           </ItemColumnCentered>
//         </ActionContent>
//       </SwipeAction>
//     </TrailingActions>
//   );

//   return (
//     <div className="basic-swipeable-list__container">
//       <SwipeableList
//         fullSwipe={fullSwipe}
//         style={{ backgroundColor: '#555878' }}
//         threshold={threshold}
//         type={ListType.IOS}
//       >
//         {people.map(({ avatar, id, name, info, status }) => (
//           <SwipeableListItem
//             key={id}
//             leadingActions={leadingActions({ id })}
//             trailingActions={trailingActions({ id })}
//             onSwipeEnd={handleSwipeEnd}
//             onSwipeProgress={setSwipeProgress}
//             onSwipeStart={handleSwipeStart}
//             onClick={handleOnClick(id)}
//           >
//             <ItemContent>
//               <ItemRow>
//                 <Avatar alt="avatar" src={avatar} />
//                 <ItemColumn>
//                   <ItemNameLine>{name}</ItemNameLine>
//                   <ItemInfoLine>
//                     {info}{' '}
//                     <span
//                       style={{
//                         backgroundColor: colors[status] || 'transparent',
//                       }}
//                     >
//                       ({status})
//                     </span>
//                   </ItemInfoLine>
//                 </ItemColumn>
//               </ItemRow>
//             </ItemContent>
//           </SwipeableListItem>
//         ))}
//       </SwipeableList>
//     </div>
//   );
// };

// export default WithOneAction;

