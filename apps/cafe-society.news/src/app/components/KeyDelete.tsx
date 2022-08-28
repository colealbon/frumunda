import React, {
  FunctionComponent,
  Fragment,
} from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { useStacks } from '../react-hooks/useStacks';
import defaultKeys from '../react-hooks/defaultKeys.json'
import useSWR, {mutate} from 'swr';

const KeyDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { fetchFile, persist } = useStacks();

  const { data: keysdata } = useSWR(
    'keys',
    () => fetchFile('keys', defaultKeys),
    { fallbackData: defaultKeys }
  );
  const keys = {...keysdata as object}

  const deleteKey = () => {
    const newKeys = {
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(keys))).filter((keyEntry: [string, unknown]) => keyEntry[0] !== props.text)
        ),
      };
    mutate('keys', persist('keys', newKeys), {
      optimisticData: newKeys,
      rollbackOnError: false
    })
  };

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(keys)))
        .filter((keyEntry: [string, unknown]) => keyEntry[0] === props.text)
        .map((keyEntry: [string, unknown]) => {
          return (
            <Fragment key={`${keyEntry[0]}`}>
              <IconButton aria-label="Delete Key" onClick={deleteKey}>
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default KeyDelete;
