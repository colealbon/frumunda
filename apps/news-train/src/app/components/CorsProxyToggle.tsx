import { FunctionComponent, Fragment, useState } from 'react';
import useSWR, { mutate } from 'swr'
import { Switch, FormControlLabel,Typography } from '@mui/material';
import { useStacks } from '../react-hooks/useStacks'

const CorsProxyToggle: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const {data: corsProxies} = useSWR('corsProxies')
  const {persist} = useStacks()
  const [inFlight, setInFlight] = useState(false)

  const toggleCorsProxy = () => {
    const newCorsProxy = {
    ...Object.fromEntries(
      Object.entries(corsProxies)
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
    )}
    const newCorsProxies = { ...corsProxies as object, ...newCorsProxy }
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
                  onChange={() => toggleCorsProxy()}
                  name={props.text}
                />
              }
              label={<Typography>{props.text}</Typography>}
            />
          );
        })}
    </Fragment>
  );
};

export default CorsProxyToggle;
