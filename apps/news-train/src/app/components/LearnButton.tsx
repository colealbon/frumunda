// import React, { useContext, useState, useCallback, useEffect} from 'react';
// import {Typography, IconButton} from '@material-ui/core'
// import { useDebouncedCallback } from 'use-debounce';
// import { CategoryContext } from './Categories';
// import { PostContext, FeedContext } from './Posts';
// import htmlToText from 'html-to-text';
// import { BlockstackStorageContext, BlockstackSessionContext } from './BlockstackSessionProvider';
// import { BlockstackFilenamesContext } from './BlockstackFilenamesFetch';
// import { useClassifiers } from '../custom-hooks/useClassifiers'
// import { useDispatchers } from '../custom-hooks/useDispatchers'
// import { useProcessedPosts } from '../custom-hooks/useProcessedPosts'
// import { removePunctuation, shortUrl, unique} from '../index.js'
// import { useKeys } from '../custom-hooks/useKeys'
// var fromEntries = require('fromentries')
// var entries = require('object.entries')
// var nacl = require('tweetnacl');
// nacl.util = require('tweetnacl-util');
// var box = require('private-box')
// const bayes = require('classificator');

// type LearnButtonProps = {
//   classification: string;
//   icon: any;
// };

// const LearnButton = (props: LearnButtonProps) => {
//   const [buttonDisabled, setButtonDisabled] = useState(false)
//   const setButtonDisabledCallback = useCallback((newState) => setButtonDisabled(newState), [])
//   const blockstackSessionContext = useContext(BlockstackSessionContext);
//   const blockstackSession = Object.assign(blockstackSessionContext);
//   const blockstackStorageContext = useContext(BlockstackStorageContext);
//   const blockstackStorage = Object.assign(blockstackStorageContext);
//   const categoryContext = useContext(CategoryContext);
//   const category = `${categoryContext}`;
//   const postContext = useContext(PostContext);
//   const post = Object.assign(postContext);
//   const feedContext = useContext(FeedContext);
//   const feed = Object.assign(feedContext)[0];
//   const {classifiers, setClassifiers} = useClassifiers();
//   const { processedPosts, setProcessedPosts } = useProcessedPosts();

//   const {dispatchers} = useDispatchers();
//   const [dispatchersForCategory, setDispatchersForCategory] = useState({})
//   const blockstackFilenamesContext = useContext(BlockstackFilenamesContext);
//   const blockstackFilenames = [...Object.values(blockstackFilenamesContext)]

//   const setProcessedPostsCallback = useCallback((newProcessedPosts) => {
//     const newProcessedPostsObj = Object.assign(newProcessedPosts as object)
//     setProcessedPosts(newProcessedPostsObj)
//   }, [setProcessedPosts])

//   const setClassifiersCallback = useCallback((newClassifiers) => {
//     const newClassifiersObj = Object.assign(newClassifiers as object)
//     setClassifiers(newClassifiersObj)
//   }, [setClassifiers])

//   const setDispatchersForCategoryCallback = useCallback((newDispatchersForCategory: any) => {
//     const newDispatchersForCategoryObj = Object.assign(newDispatchersForCategory as object)
//     setDispatchersForCategory(newDispatchersForCategoryObj)
//   }, [ setDispatchersForCategory ])

//   useEffect(() => () => {
//     const newDispatchersForCategory = fromEntries(
//         entries(
//           {...entries(
//             Object.assign(dispatchers as object || {})
//           )
//           .filter((dispatchersWithCategory: any) => dispatchersWithCategory[0] === category)
//           .map((categoryEntry: [string, unknown]) => categoryEntry[1])
//           .find(() => true) as object}
//         )
//       )
//     setDispatchersForCategoryCallback(newDispatchersForCategory)
//   }, [dispatchers, category, setDispatchersForCategoryCallback])

//   const { keys } = useKeys();

//   const theDescription = `${post.description}`
//     const descriptionText = htmlToText.fromString(theDescription, {
//     ignoreImage: true,
//   });

//   const thetitle = `${post.title}`
//   const mlText = removePunctuation(`${thetitle} ${descriptionText}`)

//   const publishClassifier = useDebouncedCallback((classifierJSON: string) => {
//     const contentToUpload = JSON.stringify(JSON.parse(`${classifierJSON}`), null, 2)

//     entries(dispatchersForCategory)
//     .filter((dispatcherEntry: [string, {keys: string[]}]) => [dispatcherEntry[1].keys].flat() !== [])
//     .forEach((dispatcherEntry: [string, any])   => {
//       const dispatcherEntryObj = [...dispatcherEntry].slice()
//       const recipientPublicKeys = entries(keys as object)
//         .filter((key: [string, string]) => {
//           return [[dispatcherEntryObj[1].keys].flat()
//             .filter((dispatcherKey: any) => `${dispatcherKey}` === key[0])]
//             .flat().length !== 0
//         })
//         .map((key: [string, {publicKey: string}]) => new Buffer(key[1].publicKey, 'base64'))

//       const classifierJSONEncrypted = box.multibox(
//         new Buffer(`${contentToUpload}`),
//         recipientPublicKeys, 10
//       ).toString('base64')

//       // const secretkey = new Buffer('ENv0yOC4uQHDUoRw8aW7Efdb2B5j5YPl7vk75fwZeU8=', 'base64')
//       // console.log(JSON.parse(box.multibox_open(new Buffer(classifierJSONEncrypted, 'base64'), secretkey).toString()))
//       blockstackStorage.putFile(`share_${category}_${dispatcherEntryObj[0]}`, classifierJSONEncrypted, {
//         encrypt: false
//       })
//       .then((successMessage: string) => {})
//       .catch((error: any) => console.log(error))
//     })

//     blockstackStorage.putFile(`classifiers_${category}`, contentToUpload, {
//       encrypt: true
//     })
//     .then((successMessage: string) => {})
//     .catch((error: any) => console.log(error))

//   }, 10000, { leading: false })

//   const processClassifier = () => {
//     const fetchQueue: any[] = blockstackFilenames
//     .filter((filename) => filename === `classifiers_${category}`)
//     .map((filename) => {
//       return new Promise((resolve) => {
//         blockstackStorage.getFile(`classifiers_${category}`, {
//           decrypt: true
//         }).then((fetchedClassifier: string) => {
//           resolve(fetchedClassifier)
//         })
//       })
//     })

//     Promise.all(fetchQueue)
//     .then((fetchedClassifier) => {
//       return new Promise((resolve, reject) => {
//         try {
//       // fetched classifier from blockstack or from local storage, or make new one
//           const classifierForCategoryJSON = fetchedClassifier.concat(
//             entries(classifiers)
//             .filter((entryWithCategory: [string, object]) => entryWithCategory[0] === category)
//             .map((classifierFromLocalStorage: [string, object]) => JSON.stringify(classifierFromLocalStorage[1]))
//             .concat(bayes().toJson())
//             .find(() => true)
//           ).find(() => true)
//           let newClassifierForCategory = bayes.fromJson(classifierForCategoryJSON)
//           newClassifierForCategory.learn(`${mlText}`, props.classification);
//           resolve(newClassifierForCategory.toJson())
//         } catch(error) {
//           reject(error)
//         }
//       })
//     })
//     .then(newClassifierForCategoryJSON => {
//       blockstackSession.isUserSignedIn() && publishClassifier(`${newClassifierForCategoryJSON}`)
//       const newClassifiers = {
//         ...classifiers as object,
//         ...JSON.parse(`{"${category}": ${newClassifierForCategoryJSON}}`)
//       }
//       setClassifiersCallback(newClassifiers)
//     })
//     .catch(error => console.log(error))
//   }

//   const publishProcessedPosts = useDebouncedCallback((newProcessedPosts: string) => {
//     const contentToUpload = `${newProcessedPosts}`
//     const uploadFilename = `${shortUrl(feed)}`
//     blockstackStorage.putFile(`${uploadFilename}`, `${contentToUpload}`, {
//       encrypt: true
//     })
//     .then((successMessage: string) => {})
//     .catch((error: any) => console.log(error))
//   }, 5000, { leading: true })

//   const processPost = () => {
//     const fetchQueue: any[] = blockstackFilenames
//     .filter((filename: any) => `${filename.toString()}` === `${shortUrl(feed)}`)
//     .map((filename) => {
//       return new Promise((resolve, reject) => {
//         blockstackStorage.getFile(filename, {decrypt: true})
//         .then((fetchedContent: string) => {
//           resolve(fetchedContent.split(','))
//         })
//       })
//     })

//     Promise.all(fetchQueue)
//     .then((fetchedProcessedPosts) => {
//       return new Promise((resolve, reject) => {
//         try {
//           // fetched classifier from blockstack if exists or from local storage

//           const processedPostsForFeed = [[fetchedProcessedPosts].concat(
//             [entries(processedPosts)
//             .filter((entryWithFeed: [string, string[]]) => entryWithFeed[0] === feed)
//             .map((processedPostsFromLocalStorage: [string, string[]]) => processedPostsFromLocalStorage[1])]
//             .find(() => true)
//           )]
//           .flat()
//           .filter(noEmpties => !!noEmpties)

//           resolve(processedPostsForFeed)
//         } catch (error) {
//           reject(error)
//         }
//       })
//     })
//     .then(processedPostsForFeed => {
//       const newProcessedPostsForFeed = unique([[processedPostsForFeed].flat().filter(processedPostItem => {
//         return processedPostItem !== mlText
//       }).concat(mlText)].flat(Infinity))

//       blockstackSession.isUserSignedIn() && publishProcessedPosts(newProcessedPostsForFeed.join(','))

//       const newProcessedPosts = {
//         ...processedPosts as object,
//         ...JSON.parse(`{"${feed}": ${JSON.stringify(newProcessedPostsForFeed)}}`)
//       }

//       setProcessedPostsCallback(newProcessedPosts)
//     })
//     .catch(error => console.log(error))
//   }

//   const handleClick = () => {
//     setButtonDisabledCallback(true)
//     processClassifier()
//     processPost()
//     process.nextTick(() => {
//       const scrollToID = mlText.replace(/ /g,"-")
//       const anchor = document.getElementById(scrollToID)
//       anchor?.scrollIntoView({behavior: "smooth"})
//     })
//   }

//   useEffect(() => {
//   // intention is to reload button without rerunning classify everywhere
//   // not 100% sure this useEffect does that.
//   }, [classifiers])

//   return (
//     <Typography variant="h3">
//     <IconButton
//       disabled={buttonDisabled}
//       style={{
//         fontSize: '100%',
//         fontFamily: 'inherit',
//         border: 0,
//         padding: 0,
//         backgroundColor: 'inherit',
//         marginRight:25,
//         marginLeft:25
//       }}
//       title={`train ${category} classifier as ${props.classification}`}
//       onClick={(event) => {
//         handleClick()
//       }}
//     >
//       {props.icon}
//     </IconButton>
//     <div id={mlText.replace(/ /g,"-")} />
//     </Typography>
//   );
// };

// export default LearnButton;
