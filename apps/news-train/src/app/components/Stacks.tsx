import React, { FunctionComponent, useEffect } from 'react';
import StacksSignIn from './StacksSignIn'
import StacksSignOut from './StacksSignOut'
import StacksProfileDisplay from './StacksProfileDisplay'
import StacksFilenamesDisplay from './StacksFilenamesDisplay'
import {useStacks} from '../react-hooks/useStacks';

const Stacks: FunctionComponent = () => {
  const {stacksSession} = useStacks()

  return (
    <div>
      {stacksSession.isUserSignedIn() && <StacksProfileDisplay/>}
      <div>
        <StacksSignIn />
        <StacksSignOut />
      </div>
      {[stacksSession.isUserSignedIn()]
        .filter(signedIn => !!signedIn)
        .map(() => {
          return (
            <StacksFilenamesDisplay key='stacksFilenames'/>
          );
        })
      }
      
    </div>
  );
};

export default Stacks;
