import { FunctionComponent, Fragment, useState } from 'react';
import { Switch } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';
import useSWR, { mutate } from 'swr';

const DispatcherToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persist } = useStorage();
  const [inFlight, setInFlight] = useState(false);

  const { data: dispatchersdata } = useSWR(
    'dispatchers'
  );

  const dispatchers = { ...(dispatchersdata as object) }

  const setDispatchersCallback = () => {
    const newDispatcher = 
      {
      ...Object.fromEntries(
        Object.entries(dispatchers)
          .filter((dispatcher: [string, unknown]) => dispatcher[0] === props.text)
          .map((dispatcher: [string, unknown]) => {
            return [
              dispatcher[0],
              {
                ...Object.fromEntries(
                  Object.entries({
                    ...(dispatcher[1] as Record<string, unknown>),
                  })
                    .filter(
                      (attribute: [string, unknown]) =>
                        attribute[0] === 'checked'
                    )
                    .map((attribute: [string, unknown]) => [attribute[0], !attribute[1]])
                ),
                ...Object.fromEntries(
                  Object.entries({
                    ...(dispatcher[1] as Record<string, unknown>),
                  }).filter((attribute: [string, unknown]) => attribute[0] !== 'checked')
                ),
              },
            ];
          })
      )
    };
    const newDispatchers = {...dispatchers, ...newDispatcher}

    mutate('dispatchers', persist('dispatchers', newDispatchers), {
      optimisticData: newDispatchers,
      rollbackOnError: false
    })
    setInFlight(false);
  }

  if (dispatchers === undefined) {
    return <></>
  }

  return (
    <Fragment key={`toggle_${props.text}`}>
      {Object.entries(dispatchers)
        .filter((dispatcher: [string, unknown]) => dispatcher[0] === props.text)
        .map((dispatcher: [string, unknown]) => {
          const attributes = dispatcher[1] as Record<string, unknown>;
          return (
            <Switch
              key={`toggle_switch_${props.text}`}
              disabled={inFlight}
              checked={Object.values(
                Object.fromEntries(
                  Object.entries(attributes).filter(
                    (attribute: [string, unknown]) => attribute[0] === 'checked'
                  )
                )
              ).some(checked => checked)}
              onChange={(event) => {
                setDispatchersCallback()
              }}
              name={props.text}
            />
          );
        })}
    </Fragment>
  );
};

export default DispatcherToggle;
