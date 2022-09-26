import { Switch, FormControlLabel } from '@mui/material';
import { useSettings } from '../react-hooks/useSettings';

const AppSettingsToggle = (props: {
  name: string
}) => {
  const { settings, toggle } = useSettings();

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {Object.entries(settings as object)
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
                  onChange={toggle(props.name)}
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
