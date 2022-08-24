import {
  FunctionComponent,
  useContext,
  useState,
  useCallback
} from 'react';
import { TextField } from '@mui/material'
import { CategoryContext } from './Category';
import { useStacks } from '../react-hooks/useStacks'
import useSWR, {mutate} from 'swr'
import defaultDispatchers from '../react-hooks/defaultDispatchers.json'

const DispatchersAdd: FunctionComponent = () => {
  const categoryContext = useContext(CategoryContext)
  const [inFlight, setInFlight] = useState(false);
  const category = `${categoryContext}`
  const [inputValue, setInputValue] = useState('');
  const { persist, fetchFile } = useStacks();
  const { data: dispatchersdata } = useSWR(`dispatchers_${category}`, () => fetchFile(`dispatchers_${category}`, defaultDispatchers), {
    fallbackData: defaultDispatchers,
    suspense: true
  });
  const dispatchers = { ...dispatchersdata as object };

  const setInputCallback = useCallback(
    (newInputValue: string) => {
      setInputValue(newInputValue);
    },
    [setInputValue]
  );

  const addDispatcher = () => {
    const newDispatcher = JSON.parse(
      `{"${inputValue}": {"checked":true}}`
    );
    const newDispatchers = { ...newDispatcher, ...dispatchers };
    setInFlight(true);
    mutate(`dispatchers_${category}`, persist(`dispatchers_${category}`, newDispatchers), {
      optimisticData: newDispatchers,
      rollbackOnError: false
    }).then(() => {
      setInFlight(false)
      //mutate(`dispatchers_${category}`)
    });
    
  };

  return (
    <div>
      <TextField
        id="addDispatcherTextField"
        disabled={inFlight}
        placeholder={`add ${category} dispatcher here`}
        value={inputValue}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onKeyPress={(event: any ) => {
          [event.key]
            .filter(theKey => theKey === 'Enter')
            .forEach(() => {
              addDispatcher();
              setInputCallback('');
          });
       }}
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       onChange={(event: any ) => {
         setInputCallback(event.target.value);
       }}
       fullWidth
      />
      {`DispatchersAdd - ${category}`}
    </div>
  )
}

export default DispatchersAdd;
