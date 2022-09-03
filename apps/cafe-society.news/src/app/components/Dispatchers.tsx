import {
  FunctionComponent,
  useContext,
  useState
} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { CategoryContext } from './Category';
import DispatchersAdd from './DispatchersAdd'
import DispatcherDelete from './DispatcherDelete'
import defaultDispatchers from '../react-hooks/defaultDispatchers.json'
import { useStorage } from '../react-hooks/useStorage'
import useSWR, {mutate} from 'swr'

// const postToBlockstackNoEncryption = (content: string) => console.log('postToBlockstackNoEncryption')
// const encryptThenPostToBlockstack = (content: string, keys: string[]) => console.log('encryptToKeys')
// export type dispatchers = { action: any[]; checked: boolean, keys?: string[]};
// import DispatcherKeys from './DispatcherKeys'
// import {
//   DeleteOutlined
// } from '@material-ui/icons'
// import {
//   TextField,
//   IconButton,
// } from '@mui/material';
// import {
//   BlockstackStorageContext,
// } from './BlockstackSessionProvider';
// export const DispatcherContext = React.createContext({});
// var promiseRetry = require('promise-retry');

const Dispatchers: FunctionComponent = () => {
  const categoryContext = useContext(CategoryContext)
  const category = `${categoryContext}`
  const [expanded, setExpanded] = useState({})
  const handleAccordionChange = (panel: string) => (
    event: unknown,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { fetchFile } = useStorage();
  const { data: dispatchersdata } = useSWR(`dispatchers_${category}`, () => fetchFile(`dispatchers_${category}`, defaultDispatchers), {
    fallbackData: defaultDispatchers,
    suspense: true
  });
  mutate(`dispatchers_${category}`)
  const dispatchers = { ...dispatchersdata as object };

  // const checkedDispatchersForCategory = dispatchersForCategory
  // .flat()
  // .map((dispatcher) => {
  //   return Object.entries(dispatcher as object)
  //   .filter((dispatcherEntry) => {
  //     return dispatcherEntry[1].checked === true
  //   }).find(() => true)
  // }).filter((dispatcher) => !!dispatcher).flat()

  return (
    <div>
      <DispatchersAdd />
      <div>
        {
        Object.keys(dispatchers).map(dispatcher => {
        return (
          <Accordion
              key={`${category}${dispatcher[0]}`}
              expanded={expanded === `${category}${dispatcher[0]}`}
              onChange={handleAccordionChange(`${category}${dispatcher[0]}`)}
              TransitionProps={{ unmountOnExit: true }}
            >
            <AccordionSummary>
              {`${dispatcher}`}
            </AccordionSummary>
            <AccordionDetails>
              <DispatcherDelete text={dispatcher} />
            </AccordionDetails>
            </Accordion>
        )
        })
      }
      </div>
    </div>
  )
}

export default Dispatchers;

//   const blockstackStorageContext = useContext(BlockstackStorageContext);
//   const blockstackStorage = Object.assign(blockstackStorageContext);
//   const { dispatchers, setDispatchers } = useDispatchers()
//   const [dispatchersForCategory, setDispatchersForCategory] = useState({})
//   const categoryContext = useContext(CategoryContext);
//   const category = `${categoryContext}`
//   const [expanded, setExpanded] = React.useState<string | false>(false);
//   const [inputValue, setInputValue] = useState('');


//   const setInputCallback = useCallback(
//     (newInputValue: string) => {
//       setInputValue(newInputValue);
//     },
//     [setInputValue]
//   );

//   const setDispatchersForCategoryCallback = useCallback((newDispatchersForCategory) => {
//     setDispatchersForCategory(newDispatchersForCategory)
//   }, [ setDispatchersForCategory ])

//   const addDispatcherCallback = useCallback(() => {
//     const newDispatcher = JSON.parse(
//       `{"${inputValue}": {"checked": true, "URIValue": "" }}`
//     );
//     const newDispatchersForCategory = {...dispatchersForCategory as object, ...newDispatcher as object}
//     setDispatchersForCategoryCallback(newDispatchersForCategory)
//     const newDispatchers = {...dispatchers as object, ...JSON.parse(`{"${category}":${JSON.stringify(newDispatchersForCategory)}}`)}
//     setDispatchers(newDispatchers)
//     return promiseRetry(function(retry: Function, number: number) {
//       const fileContent = JSON.stringify(newDispatchers, null, 2)
//       return blockstackStorage.putFile(`dispatchers_${category}`, fileContent, {
//           encrypt: true,
//         })
//       .catch(retry);
//     })
//   }, [dispatchers, setDispatchersForCategoryCallback, dispatchersForCategory, setDispatchers, category, inputValue, blockstackStorage]);

//   const deleteDispatcherCallback = useCallback((dispatcher: String) => {
//     const newDispatchersForCategory = fromEntries(
//     entries(
//       entries(
//         Object.assign(dispatchers as object || {})
//       )
//       .filter((dispatchersWithCategory: any) => dispatchersWithCategory[0] === category)
//       .map((categoryEntry: [string, string]) => categoryEntry[1])
//       .find(() => true) as object
//     )
//     .filter((dispatcherEntry: [string, object]) => {
//       return dispatcherEntry[0] !== `${dispatcher}`
//     }))

//     setDispatchersForCategoryCallback(newDispatchersForCategory)

//     const newDispatchers = {
//       ...dispatchers as object,
//       ...JSON.parse(
//        `{"${category}":${JSON.stringify(newDispatchersForCategory)}}`
//       )
//     }

//     setDispatchers(newDispatchers)

//     promiseRetry(function( retry: any, number: any) {
//       return blockstackStorage.putFile(
//         `dispatchers_${category}`,
//         JSON.stringify(newDispatchersForCategory, null, 2), {
//           encrypt: true,
//         }
//       )
//       .catch(retry);
//     })

//   }, [setDispatchersForCategoryCallback, setDispatchers, blockstackStorage, dispatchers, category]);

//   return <>
//     <TextField
//       id="addDispatcherTextField"
//       placeholder={`add ${category} dispatcher here`}
//       value={inputValue}
//       onKeyPress={event => {
//         [event.key]
//           .filter(theKey => theKey === 'Enter')
//           .forEach(() => {
//             addDispatcherCallback();
//             setInputCallback('');
//           });
//       }}
//       onChange={event => {
//         setInputCallback(event.target.value);
//       }}
//       fullWidth
//     />
//     {
//       [entries({...dispatchersForCategory as object})].flat().map((dispatcher) => {
//         const dispatcherLabel = `${dispatcher[0]}`
//         return (
//           <DispatcherContext.Provider key={dispatcher.toString()} value={dispatcherLabel}>

//               <AccordionSummary>
//                   <>{dispatcherLabel}</>
//                   <IconButton aria-label="Delete Dispatcher" onClick={(event: any) => {
//                     event.preventDefault()
//                     deleteDispatcherCallback(dispatcherLabel)
//                   }} >
//                     <DeleteOutlined />
//                   </IconButton>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <DispatcherKeys />
//               </AccordionDetails>
//             </Accordion>
//           </DispatcherContext.Provider>
//         )
//       })
//     }
