import { FunctionComponent } from 'react';
// import KeysAdd from './KeysAdd';
// import KeysJSON from './KeysJSON';
// import KeysReset from './KeysReset';
import KeyToggle from './KeyToggle';
// import KeyDelete from './KeyDelete';
import {useStacks} from '../react-hooks/useStacks'
import useSWR from 'swr'
import defaultKeys from '../react-hooks/defaultKeys.json'
import {Box} from '@mui/material'

const Keys: FunctionComponent = () => {

  const { fetchFile } = useStacks();
  const { data: keysdata } = useSWR(
    'keys',
    () => fetchFile('keys', defaultKeys),
    { fallbackData: defaultKeys }
  );
  const keys = { ...(keysdata as object) };

  return (
    <>
      {/* <Box p={1}>
        <KeysAdd />
      </Box>
      */}
      <Box p={1} maxWidth={600}>
        {Object.keys(JSON.parse(JSON.stringify(keys))).map(key => {
          return (
            <Box key={key}>
              <Box display="flex">
                <Box width="100%">
                  <KeyToggle text={key} />
                </Box>
                {/* <Box flexShrink={0}>
                  <KeyDelete text={key} />
                </Box> */}
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* <Box p={1}>
        <KeysReset />
      </Box> */}
      <pre>{JSON.stringify(keys, null, 2)}</pre>
    </>
  );
};

export default Keys;
