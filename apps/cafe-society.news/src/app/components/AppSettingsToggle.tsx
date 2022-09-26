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
                  checked={attributes['checked'] as boolean}
                  onChange={toggle(props.name)}
                  name={props.name}
                />
              }
              label={attributes['label'] as string}
            />
          );
        })}
    </div>
  );
};

export default AppSettingsToggle;
