import React, { FunctionComponent } from 'react';
import {Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';

const StacksProfileDisplay: FunctionComponent = () => {
  const { stacksSession }  = useStacks()
  return (
    <>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !!signedIn)
        .map(() => {
          return (
            <Typography key='blockstackname'>{`${stacksSession.loadUserData().profile.name}`}</Typography>
          );
        })}
    </>
  );
};

export default StacksProfileDisplay;
