import { Fragment, FunctionComponent } from 'react';
import { Button, Typography } from '@mui/material';
import { useStorage } from '../react-hooks/useStorage';

const BlockstackSignOut: FunctionComponent = () => {
  const { userSession } = useStorage();

  if (!userSession.isUserSignedIn()) {
    return <span></span>;
  }

  return (
    <Fragment key="stackssignout">
      {[userSession.isUserSignedIn()]
        .filter((signedIn) => !!signedIn)
        .map((key, index) => {
          return (
            <Button
              key={index}
              onClick={() => userSession.signUserOut(window.location.origin)}
            >
              <Typography key="signout">sign out</Typography>
            </Button>
          );
        })}
    </Fragment>
  );
};

export default BlockstackSignOut;
