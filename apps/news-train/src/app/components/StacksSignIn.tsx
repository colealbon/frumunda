import React, { FunctionComponent } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';
// import { BlockstackSessionContext } from './BlockstackSessionProvider';
import { showConnect } from '@stacks/connect';

const StacksSignin: FunctionComponent = () => {
  const { stacksSession }  = useStacks()

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'cafe-society',
        icon: 'https://cafe-society.news/logo192.png',
      },
      redirectTo: '/',
      onFinish: () => {
        stacksSession.loadUserData();
      },
    //   finished: () => {
    //     window.location.reload();
    //   },
      userSession: stacksSession,
    });
  };

  return (
    <>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !signedIn)
        .map(() => {
          return (
            <Button key="blockstacksignin" onClick={() => authenticate()}>
              <Typography variant="h3">sign in</Typography>
            </Button>
          );
        })}
    </>
  );
};

export default StacksSignin;
