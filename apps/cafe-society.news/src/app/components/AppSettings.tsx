import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import AppSettingsToggle from './AppSettingsToggle';
import AppSettingsReset from './AppSettingsReset';
import {useSettings} from '../react-hooks/useSettings'

const Settings: FunctionComponent = () => {
  const {settings } = useSettings()
  return (
    <>
      <Box p={1}>
        {Object.keys(settings as object).map(appSetting => {
          return <AppSettingsToggle name={appSetting} key={appSetting} />;
        })}
      </Box>
      <Box p={1}>
        <AppSettingsReset />
      </Box>
    </>
  );
};

export default Settings;