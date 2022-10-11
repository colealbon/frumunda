import { FunctionComponent, Fragment, useState } from 'react';
import { Switch } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';
import useSWR, { mutate } from 'swr';
import defaultKeys from '../react-hooks/defaultKeys.json'

const KeyToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persist } = useStorage();
  const [inFlight, setInFlight] = useState(false);

  const { data: keysdata } = useSWR(
    'keys',
    {fallbackData: defaultKeys}
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
            <Switch
              data-testid={`toggle_${props.text}`}
              key={props.text}
              title={`toggle_${props.text}`}
              disabled={inFlight}
              checked={Object.values(
                Object.fromEntries(
                  Object.entries(attributes).filter(
                    (attribute: [string, unknown]) => attribute[0] === 'checked'
                  )
                )
              ).some(checked => checked)}
              onChange={() => setKeysCallback()}
              name={`toggle_${props.text}`}
            />
          );
        })}
    </Fragment>
  );
};

export default KeyToggle;
