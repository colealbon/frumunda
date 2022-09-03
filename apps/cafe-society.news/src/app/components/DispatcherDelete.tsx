import { FunctionComponent, Fragment, useState } from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { useStorage } from '../react-hooks/useStorage';
import defaultDispatchers from '../react-hooks/defaultDispatchers.json';

const DispatcherDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persistLocal, fetchFileLocal } = useStorage();
  const { data: dispatchersdata } = useSWR(
    'Dispatchers',
    fetchFileLocal('Dispatchers', defaultDispatchers),
    { fallbackData: defaultDispatchers }
  );
  const dispatchers = { ...(dispatchersdata as object) };
  const [inFlight, setInFlight] = useState(false);

  const deleteDispatcher = () => {
    setInFlight(true);
    const newDispatchers = {
      ...Object.fromEntries(
        Object.entries(dispatchers).filter(
          (dispatcher: [string, unknown]) => dispatcher[0] !== props.text
        )
      ),
    };
    mutate('dispatchers', persistLocal('dispatchers', newDispatchers), {
      optimisticData: newDispatchers,
      rollbackOnError: true,
    }).then(() => setInFlight(false));
  };

  return (
    <Fragment>
      {Object.entries(dispatchers)
        .filter((dispatcher: [string, unknown]) => dispatcher[0] === props.text)
        .map((dispatcher: [string, unknown]) => {
          return (
            <Fragment key={`${dispatcher}`}>
              <IconButton
                disabled={inFlight}
                aria-label="delete dispatcher"
                onClick={deleteDispatcher}
              >
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default DispatcherDelete;
