import React, { FunctionComponent } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';

const StacksProfileDisplay: FunctionComponent = () => {
  const { stacksSession }  = useStacks()
  return (
    <>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !!signedIn)
        .map(() => {
          return (
            <textarea key='textareaStacksProfile' rows={20} cols={50} defaultValue={JSON.stringify(stacksSession.loadUserData(), null, 2)} />
          );
        })}
    </>
  );
};

export default StacksProfileDisplay;
