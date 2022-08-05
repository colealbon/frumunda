import React, { useCallback } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { useSettings } from '../react-hooks/useSettings';

const AppSettingsToggle = (props: {
  name: string;
}) => {
  const { settings, persistSettings } = useSettings();
  const setSettingsCallback = useCallback(() => {
    const newSetting = JSON.parse(
      JSON.stringify({
        ...Object.fromEntries(
          Object.entries(JSON.parse(JSON.stringify(settings)))
            .filter((setting: [string, unknown]) => setting[0] === props.name)
            .map((setting: [string, unknown]) => {
              return [
                setting[0],
                {
                  ...Object.fromEntries(
                    Object.entries({
                      ...(setting[1] as Record<string, unknown>),
                    })
                      .filter(
                        (attribute: [string, unknown]) =>
                          attribute[0] === 'checked'
                      )
                      .map((attribute: [string, unknown]) => [attribute[0], !attribute[1]])
                  ),
                  ...Object.fromEntries(
                    Object.entries({
                      ...(setting[1] as Record<string, unknown>),
                    }).filter((attribute: [string, unknown]) => attribute[0] !== 'checked')
                  ),
                },
              ];
            })
        ),
      })
    );
    persistSettings({ ...JSON.parse(JSON.stringify(settings)), ...newSetting });
  }, [settings, props.name, persistSettings]);

  return (

    <div style={{display: 'flex', flexDirection: 'column'}}>
      {Object.entries(JSON.parse(JSON.stringify(settings)))
        .filter((setting: [string, unknown]) => setting[0] === props.name)
        .map((setting: [string, unknown]) => {
          const attributes = setting[1] as Record<string, unknown>;
          return (
            <FormControlLabel
              key={setting[0]}
              control={
                <Switch
                  checked={Object.values(
                    Object.fromEntries(
                      Object.entries(attributes).filter(
                        (attribute: [string, unknown]) => attribute[0] === 'checked'
                      )
                    )
                  ).some(checked => checked)}
                  onChange={() => setSettingsCallback()}
                  name={props.name}
                />
              }
              label={`${
                [
                  Object.entries(attributes).find(
                    (attribute: [string, unknown]) => attribute[0] === 'label'
                  ),
                ]
                  .flat()
                  .slice(-1)[0]
              }`}
            />
          );
        })}
    </div>
  );
};

export default AppSettingsToggle;
