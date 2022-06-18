import React, { FunctionComponent, useEffect } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';
import { showConnect } from '@stacks/connect';
import { useSelectedCategoryIndex } from '../react-hooks/useSelectedCategoryIndex'
import { useSelectedPageIndex } from '../react-hooks/useSelectedPageIndex'

const StacksSignin: FunctionComponent = () => {
  const { stacksSession }  = useStacks()
  const { mutateSelectedCategoryIndex } = useSelectedCategoryIndex()
  const { mutateSelectedPageIndex } = useSelectedPageIndex()

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'cafe-society',
        icon: 'https://cafe-society.news/logo192.png',
      },
      redirectTo: '/',
      onFinish: () => {
        stacksSession.loadUserData();
        window.location.reload()
        mutateSelectedCategoryIndex()
        mutateSelectedPageIndex()
      },
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
              <Typography>sign in</Typography>
            </Button>
          );
        })}
    </>
  );
};

export default StacksSignin;
