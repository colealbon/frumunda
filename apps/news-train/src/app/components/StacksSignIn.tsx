import { FunctionComponent } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';
import { showConnect } from '@stacks/connect';

const StacksSignin: FunctionComponent = () => {
  
  const { userSession }  = useStacks()

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'cafe-society',
        icon: 'https://cafe-society.news/logo192.png',
      },
      redirectTo: '/',
      onFinish: () => {
        userSession.loadUserData();
        window.location.reload()
      },
      userSession: userSession,
    });
  };


  return (
    <>
      {[userSession.isUserSignedIn()]
        .filter(signedIn => !signedIn)
        .map(() => {
          return (
            <Button key="blockstacksignin" onClick={() => authenticate()}>
              <Typography>sign in</Typography>
            </Button>
          );
        })}
    </>
  );
};

export default StacksSignin;
