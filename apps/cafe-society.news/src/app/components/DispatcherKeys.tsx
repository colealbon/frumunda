import { FunctionComponent, SyntheticEvent } from 'react'
import {useStorage} from '../react-hooks/useStorage'
import useSWR, {mutate} from 'swr'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {dispatcherValueType} from '../types'

const DispatcherKeys: FunctionComponent<{ dispatcherLabel: string }> = (props: {
  dispatcherLabel: string;
}) => {
  const { persistLocal } = useStorage();
  const { data: dispatchersdata } = useSWR('dispatchers');

  const dispatchers: object = dispatchersdata as object;

  const keysForDispatcher = Object.entries(dispatchers)
    .filter((dispatcherEntry) => dispatcherEntry[0] === props.dispatcherLabel)
    .map(dispatcherEntry => dispatcherEntry[1])
    .find(() => true)['keys']

  const { data: keysdata } = useSWR('keys');
  const keys = { ...(keysdata as object) };
  
  const handleChange = (e: SyntheticEvent, newValue: string[]) => {
    const newDispatcher =  Object.fromEntries(Object.entries(dispatchers).filter((dispatcherEntry) => {
      return dispatcherEntry[0] === props.dispatcherLabel
    }).map(dispatcherEntry => {
      return [dispatcherEntry[0],  {...dispatcherEntry[1], ...{keys: newValue}} as dispatcherValueType ]
    })
    )
    const newDispatchers = {...dispatchers, ...newDispatcher}
    mutate('dispatchers', persistLocal('dispatchers', newDispatchers), {
      optimisticData: newDispatchers,
      rollbackOnError: false
    })
  };

  return (
    <Autocomplete
      disablePortal
      id={`${props.dispatcherLabel}-keys`}
      multiple
      freeSolo
      options={
        [Object.keys(keys as object)]
        .flat(Infinity)
      }
      onChange={(e, value) => handleChange(e, value as string[])}
      value={keysForDispatcher}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={`${props.dispatcherLabel} - keys`}
          />
        )
      }}
    />
  );
}

export default DispatcherKeys;
