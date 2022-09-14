import { FunctionComponent, Fragment, useState } from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { useStorage } from '../react-hooks/useStorage';

const DispatcherDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { persistLocal } = useStorage();
  const { data: dispatchers } = useSWR('dispatchers');
  const [inFlight, setInFlight] = useState(false);

  const deleteDispatcher = () => {
    setInFlight(true);
    const newDispatchers = {
      ...Object.fromEntries(
        Object.entries({ ...dispatchers }).filter(
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
      {Object.entries({ ...dispatchers })
        .filter((dispatcher: [string, unknown]) => dispatcher[0] === props.text)
        .map((dispatcher: [string, unknown]) => {
          return (
            <Fragment key={`${dispatcher}`}>
              <IconButton
                disabled={inFlight}
                aria-label="Delete Dispatcher"
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
