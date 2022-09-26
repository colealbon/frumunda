import { FunctionComponent } from 'react';
import KeysAdd from './KeysAdd';
import KeysReset from './KeysReset';
import KeyToggle from './KeyToggle';
import KeyDelete from './KeyDelete';
import {useStorage} from '../react-hooks/useStorage'
import useSWR from 'swr'
import defaultKeys from '../react-hooks/defaultKeys.json'
import {Box, Typography} from '@mui/material'

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
      <Box p={1}>
        <KeysAdd />
      </Box>
      <Box p={1} maxWidth={600}>
        {Object.keys(keys).map(key => {
          return (
            <Box key={key}>
              <Box display="flex">
                <KeyToggle text={key} />
                <Box flexShrink={0}>
                  <KeyDelete text={key} />
                </Box>
                <Box >{key}</Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box p={1}>
        <KeysReset />
      </Box>
    </>
  );
};

export default Keys;
