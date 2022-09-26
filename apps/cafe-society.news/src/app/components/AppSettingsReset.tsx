import React, { FunctionComponent } from 'react';
import {Button}  from '@mui/material';
import { useSettings } from '../react-hooks/useSettings';

const AppSettingsReset: FunctionComponent = () => {
  const { factoryReset } = useSettings();
  const handleOnClick = () => factoryReset()
  return (
    <Button key="appsettingsreset" onClick={handleOnClick}>
      reset app settings
    </Button>
  );
};
export default AppSettingsReset;