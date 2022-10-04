import { FunctionComponent } from 'react';
import KeysAdd from './KeysAdd';
import KeysReset from './KeysReset';
import KeyToggle from './KeyToggle';
import KeyDelete from './KeyDelete';
import {useStorage} from '../react-hooks/useStorage'
import useSWR from 'swr'
import defaultKeys from '../react-hooks/defaultKeys.json'
import {Typography} from '@mui/material'

const Keys: FunctionComponent = () => {

  const { fetchFile } = useStorage();
  const { data: keysdata } = useSWR(
    'keys',
    () => fetchFile('keys', defaultKeys),
    { fallbackData: defaultKeys }
  );
  const keys = { ...(keysdata as object) };

  return (
    <>
      <div>
        <KeysAdd />
      </div>
      <div>
        {Object.keys(keys).map(key => {
          return (
            <div key={key}>
              <KeyToggle text={key} />
              <div />
              <KeyDelete text={key} />
              <div />
              <Typography>{key}</Typography>
            </div>
          );
        })}
      </div>
      <div>
        <KeysReset />
      </div>
    </>
  );
};

export default Keys;
