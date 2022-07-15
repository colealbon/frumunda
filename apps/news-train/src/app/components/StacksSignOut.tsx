import { Fragment, FunctionComponent, useEffect } from 'react';
import {Button, Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';

const BlockstackSignOut: FunctionComponent = () => {
  const { stacksSession }  = useStacks()

  useEffect(() => {
    // console.log('reload')
    // reload
  }, [stacksSession])

  return (
    <Fragment key='stackssignout'>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !!signedIn)
        .map((key, index) => {
          return (
            <Button
              key={index}
              onClick={() =>
                stacksSession.signUserOut(window.location.origin)
              }
            >
              <Typography key='signout'>sign out</Typography>
            </Button>
          );
        })}
    </Fragment>
  );
};

export default BlockstackSignOut;
