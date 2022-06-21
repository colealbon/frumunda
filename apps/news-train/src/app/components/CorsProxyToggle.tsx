import React, { useCallback, FunctionComponent, Fragment } from 'react';
import { Switch, FormControlLabel,Typography} from '@mui/material';
import { useCorsProxies } from '../react-hooks/useCorsProxies';

const CorsProxyToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { corsProxies, publishCorsProxies, inFlight } = useCorsProxies()

  const setCorsProxiesCallback = useCallback(() => {
    const newCorsProxy = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(corsProxies)))
            .filter((corsProxy: [string, unknown]) => corsProxy[0] === props.text)
            .map((corsProxy: [string, unknown]) => {
              return [
                corsProxy[0],
                {
                  ...Object.fromEntries(
                    Object.entries({
                      ...(corsProxy[1] as Record<string, unknown>),
                    })
                      .filter(
                        (attribute: [string, unknown]) =>
                          attribute[0] === 'checked'
                      )
                      .map((attribute : [string, unknown]) => [attribute[0], !attribute[1]])
                  ),
                  ...Object.fromEntries(
                    Object.entries({
                      ...(corsProxy[1] as Record<string, unknown>),
                    }).filter((attribute : [string, unknown]) => attribute[0] !== 'checked')
                  ),
                },
              ];
            })
        ),
      })
    );
    const newCorsProxies = { ...JSON.parse(JSON.stringify(corsProxies)), ...newCorsProxy }
    publishCorsProxies(newCorsProxies)

  }, [corsProxies, props.text, publishCorsProxies]);

  return (
    <Fragment>
      {Object.entries(JSON.parse(JSON.stringify(corsProxies)))
        .filter((corsProxy : [string, unknown]) => corsProxy[0] === props.text)
        .map((corsProxy : [string, unknown]) => {
          const attributes = corsProxy[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              disabled={inFlight}
              key={corsProxy[0]}
              control={
                <Switch
                  size='medium'
                  checked={Object.values(
                    Object.fromEntries(
                      [Object.entries({...attributes})].flat().filter(
                        (attribute : [string, unknown]) => attribute[0] === 'checked'
                      )
                    )
                  ).some(checked => checked)}
                  onChange={() => setCorsProxiesCallback()}
                  name={props.text}
                />
              }
              label={<Typography variant="h3">{props.text}</Typography>}
            />
          );
        })}
    </Fragment>
  );
};

export default CorsProxyToggle;
