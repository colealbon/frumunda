import {FunctionComponent} from 'react';
import {Button}  from '@mui/material';
import {useSettings} from '../react-hooks/useSettings'
const AppSettingsReset: FunctionComponent = () => {
  const { factoryReset } = useSettings()
  return (
    <Button key="appsettingsreset" onClick={factoryReset}>
      reset app settings
    </Button>
  );
};
export default AppSettingsReset;