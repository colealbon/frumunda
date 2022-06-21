import React, {
  useCallback,
  FunctionComponent,
  Fragment,
} from 'react';
import { IconButton } from '@mui/material';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { useCorsProxies } from '../react-hooks/useCorsProxies';

const CorsProxyDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { corsProxies, publishCorsProxies, inFlight } = useCorsProxies()

  const deleteCorsProxy = useCallback(() => {
    const newCorsProxies = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(corsProxies))).filter(
            (corsProxy: [string, unknown]) => corsProxy[0] !== props.text
          )
        ),
      })
    );
    publishCorsProxies(newCorsProxies);
  }, [corsProxies, props.text, publishCorsProxies]);

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(corsProxies)))
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
