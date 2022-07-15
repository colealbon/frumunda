import { FunctionComponent, useContext, createContext, useState} from 'react';
import { ParsedFeedContentContext } from './Feed'
import Post from './Post'
import { useProcessedPosts } from '../react-hooks/useProcessedPosts'
import {
  Link,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box
} from '@mui/material';
import {
  SwipeableList,
  Type as ListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import {ExpandMore} from '@mui/icons-material';
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
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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

      const postsForFeed = structuredClone({...feedContentEntry[1] as object}).items

      const unprocessedCleanPostItems = postsForFeed.map((postItem: cleanPostItemType) => cleanPostItem(postItem))
        .filter((postItem: cleanPostItemType) => {
          const mlText = removePunctuation(`${postItem.title} ${postItem.description}`)
          return !processedPostsForFeed.find((postItem: string) => {
            const similarity = stringSimilarity.compareTwoStrings(`${removePunctuation(postItem)}`, mlText)
            return similarity > .82
          })
        })

        if (unprocessedCleanPostItems.length === 0) {
          return (
            <Accordion expanded={false} key={`accordion-${feedLink}`}>
              <AccordionSummary
                aria-controls={`${feedLink}-content`}
                id={`${feedLink}-header`}
                key={`accordion-${feedLink}`}
              >
                <Box   
                  display="flex"
                  alignItems="flex-start"
                  flexDirection="column"
                  key={`box-${feedLink}`}
                >
                  <Typography variant='h3'>
                    <Link href={`${feedLink}`} component="button">
                      {`${feedTitleText}`}
                    </Link>
                  </Typography>
                  <Typography variant="caption">
                    {` ${feedDescription}`}
                  </Typography>
                  <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} posts remaining)`}</Typography>
                </Box>
              </AccordionSummary>
            </Accordion>

          )
        }
        return (
          <Accordion 
            expanded={expanded === `panel-${feedLink}`} 
            onChange={handleChange(`panel-${feedLink}`)}
            key={`accordion-${feedLink}`}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`${feedLink}-content`}
              id={`${feedLink}-header`}
              key={`${feedLink}-header`}
            >
              <Box   
                display="flex"
                alignItems="flex-start"
                flexDirection="column"
              >
                <Typography variant='h3'>
                  <Link href={`${feedLink}`} component="button">
                    {`${feedTitleText}`}
                  </Link>
                </Typography>
                <Typography variant="caption">
                  {` ${feedDescription}`}
                </Typography>
                <Typography variant='caption'>{` (${unprocessedCleanPostItems.length} of ${postsForFeed.length} posts remaining)`}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {
                unprocessedCleanPostItems.map((cleanPostItem: cleanPostItemType) => {
                  return (
                    <PostContext.Provider value={cleanPostItem} key={`postitem-swipeable-list-${cleanPostItem.link}`}>
                      <Post key={JSON.stringify(cleanPostItem)} />
                    </PostContext.Provider>
                  )
                })
              }
              <MarkFeedProcessedButton />
            </AccordionDetails>
          </Accordion>
        )
        })
      }
    </>
  )
}

export default Posts;

// import React from 'react';


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