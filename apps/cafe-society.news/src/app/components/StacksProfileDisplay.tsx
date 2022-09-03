import { FunctionComponent } from 'react';
import { Typography } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';

const StacksProfileDisplay: FunctionComponent = () => {
  const { userSession } = useStorage();
  if (!userSession.isUserSignedIn()) {
    return <span></span>;
  }
  return (
    <Typography key="blockstackname">{`${
      userSession.loadUserData().profile.name
    }`}</Typography>
  );
};

export default StacksProfileDisplay;
