import React, { FunctionComponent, useContext, createContext, Fragment } from 'react';
import { 
    PostContext
    //, FeedContext 
} from './Posts';
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
  const postContext = useContext(PostContext)
  const postItem = Object.assign(postContext)
//   const categoryContext = useContext(CategoryContext);
//   const category = `${categoryContext}`;
//   const feedContext = useContext(FeedContext)
//   const feed = Object.assign(feedContext)[0]
  return (
    <pre>{`${JSON.stringify(postItem, null, 2)}`}</pre>
//     <Box
//       style={{
//         textAlign: 'center',
//         maxWidth: 600
//       }}
//     >
//       <ListItem
//         key={`item-${category}-${
//           JSON.stringify(
//             postItem
//           ) || ''
//         }`}
//         className="post-item-anchor"
//       >
//         <ListItemText
//           primary={
//             <Link
//               key={postItem.link}
//               href={new URL(
//                 `${postItem.link}`,
//                 new URL(
//                   `${postItem.link}`,
//                   new URL(
//                     feed
//                   )
//                 )
//               ).toString()}
//               target="news-train"
//             >
//               <Box
//                 style={{
//                   marginBottom: 25,
//                   marginTop: 40,
//                 }}
//               >
//                 <Typography variant="h3">
//                   {postItem.title.replace(
//                     '&mdash;',
//                     ''
//                   )}
//                 </Typography>
//               </Box>
//             </Link>
//           }
//         />
//       </ListItem>
//       <ListItem
//         key={`item-${category}-${
//           JSON.stringify(
//             postItem
//           ) || ''
//         }xxx`}
//       >
//         <ListItemText
//           primary={[
//             [postItem.description]
//               .flat()
//               .filter(
//                 description =>
//                   !!description
//               )
//               .filter(
//                 description =>
//                   description !==
//                   'undefined'
//               )
//               .find(() => true),
//           ]
//             .flat()
//             .filter(
//               (
//                 description?: string
//               ) => !!description
//             )
//             .map(
//               (
//                 description?: string
//               ) => {
//                 const theText =
//                   htmlToText
//                     .fromString(
//                       description ||
//                         '',
//                       {
//                         ignoreHref:
//                           true,
//                         ignoreImage:
//                           true,
//                       }
//                     )
//                     .replace(
//                       '&mdash;',
//                       ''
//                     );
//                 return (
//                   <Typography
//                     variant="h3"
//                     key={theText}
//                   >
//                     {theText}
//                   </Typography>
//                 );
//               }
//             )}
//         />
//       </ListItem>
//    </Box>
  );
};

export default Post;
