import { FunctionComponent, Fragment, useState } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { useStacks } from '../react-hooks/useStacks';
import useSWR, { mutate } from 'swr';

const KeyToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persist } = useStacks();
  const [inFlight, setInFlight] = useState(false);

  const { data: keysdata } = useSWR(
    'keys'
  );

  const keys = { ...(keysdata as object) }

  const setKeysCallback = () => {
    const newKey = 
      {
      ...Object.fromEntries(
        Object.entries(keys)
          .filter((key: [string, unknown]) => key[0] === props.text)
          .map((key: [string, unknown]) => {
            return [
              key[0],
              {
                ...Object.fromEntries(
                  Object.entries({
                    ...(key[1] as Record<string, unknown>),
                  })
                    .filter(
                      (attribute: [string, unknown]) =>
                        attribute[0] === 'checked'
                    )
                    .map((attribute: [string, unknown]) => [attribute[0], !attribute[1]])
                ),
                ...Object.fromEntries(
                  Object.entries({
                    ...(key[1] as Record<string, unknown>),
                  }).filter((attribute: [string, unknown]) => attribute[0] !== 'checked')
                ),
              },
            ];
          })
      )
    };
    const newKeys = {...keys, ...newKey}

    mutate('keys', persist('keys', newKeys), {
      optimisticData: newKeys,
      rollbackOnError: false
    })
    setInFlight(false);
  }

  return (
    <Fragment>
      {Object.entries(keys)
        .filter((key: [string, unknown]) => key[0] === props.text)
        .map((key: [string, unknown]) => {
          const attributes = key[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              disabled={inFlight}
              key={key[0]}
              control={
                <Switch
                  checked={Object.values(
                    Object.fromEntries(
                      Object.entries(attributes).filter(
                        (attribute: [string, unknown]) => attribute[0] === 'checked'
                      )
                    )
                  ).some(checked => checked)}
                  onChange={() => setKeysCallback()}
                  name={props.text}
                />
              }
              label={props.text}
            />
          );
        })}
    </Fragment>
  );
};

export default KeyToggle;
