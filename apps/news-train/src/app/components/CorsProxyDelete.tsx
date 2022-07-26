import {
  FunctionComponent,
  Fragment,
  useState
} from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import {useStacks} from '../react-hooks/useStacks'
import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'


const CorsProxyDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { persistLocal, fetchFileLocal } = useStacks()
  const {data: corsProxiesdata} = useSWR('corsProxies', fetchFileLocal('corsProxies', defaultCorsProxies), {fallbackData: defaultCorsProxies})
  const corsProxies = {...corsProxiesdata as object}
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
      persistLocal('corsProxies', newCorsProxies), 
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
