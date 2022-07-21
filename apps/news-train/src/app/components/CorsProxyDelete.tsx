import {
  FunctionComponent,
  Fragment,
  useState
} from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import {useStacks} from '../react-hooks/useStacks'

const CorsProxyDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { persist } = useStacks()
  const { data: corsProxies } = useSWR('corsProxies')
  const [inFlight, setInFlight] = useState(false)
  
  const deleteCorsProxy = () => {
    setInFlight(true)
    const newCorsProxies = {
      ...Object.fromEntries(
        Object.entries(corsProxies).filter(
          (corsProxy: [string, unknown]) => corsProxy[0] !== props.text
        )
      ),
    }
    mutate(
      'corsProxies', 
      persist('corsProxies', newCorsProxies), 
      { optimisticData: newCorsProxies, rollbackOnError: true }
    )
    .then(() => setInFlight(false))
  }

  return (
    <Fragment>
      {Object.entries(corsProxies)
        .filter((corsProxy: [string, unknown]) => corsProxy[0] === props.text)
        .map((corsProxy: [string, unknown]) => {
          return (
            <Fragment key={`${corsProxy}`}>
              <IconButton disabled={inFlight} aria-label="Delete CorsProxy" onClick={deleteCorsProxy}>
                <DeleteOutlined />
              </IconButton>
            </Fragment>
          );
        })}
    </Fragment>
  );
};

export default CorsProxyDelete;
