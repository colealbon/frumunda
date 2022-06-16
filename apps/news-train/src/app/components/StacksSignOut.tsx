import React, { FunctionComponent } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';

const BlockstackSignOut: FunctionComponent = () => {
  const { stacksSession }  = useStacks()
  return (
    <>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !!signedIn)
        .map(() => {
          return (
            <Button
              key="blockstacksignout"
              onClick={() =>
                stacksSession.signUserOut(window.location.origin)
              }
            >
              <Typography variant="h2">sign out</Typography>
            </Button>
          );
        })}
    </>
  );
};

export default BlockstackSignOut;
