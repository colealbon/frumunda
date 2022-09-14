import { FunctionComponent, SyntheticEvent } from 'react'
import {useStorage} from '../react-hooks/useStorage'
import useSWR, {mutate} from 'swr'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const DispatcherKeys: FunctionComponent<{ dispatcherLabel: string }> = (props: {
  dispatcherLabel: string;
}) => {
  const { fetchFile, persist } = useStorage();
  const { data: keysdata } = useSWR('keys');
  const keys = { ...(keysdata as object) };

  const { data: keysfordispatcherdata } = useSWR(
    `keys_${props.dispatcherLabel}`,
    () => fetchFile(`keys_${props.dispatcherLabel}`, []),
    { 
      fallbackData: [],
      suspense: true,
      shouldRetryOnError: true,
      errorRetryInterval: 100
    }
  );
  const keysForDispatcher = keysfordispatcherdata as string[]

  const handleChange = (e: SyntheticEvent, newValue: string[]) => {
    mutate(`keys_${props.dispatcherLabel}`, persist(`keys_${props.dispatcherLabel}`, newValue), {
      optimisticData: newValue,
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
      defaultValue={keysForDispatcher}
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
