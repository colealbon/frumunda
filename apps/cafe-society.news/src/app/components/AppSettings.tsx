import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

import AppSettingsToggle from './AppSettingsToggle';
import AppSettingsReset from './AppSettingsReset';
import {useSettings} from '../react-hooks/useSettings'

const Settings: FunctionComponent = () => {
  const {settings } = useSettings()
  return (
    <>
      <div>
        {Object.keys(settings as object).map(appSetting => {
          return <AppSettingsToggle name={appSetting} key={appSetting} />;
        })}
      </div>
      <div>
        <AppSettingsReset />
      </div>
    </>
  );
};

export default Settings;