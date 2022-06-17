import React, { FunctionComponent, useEffect } from 'react';
import StacksSignIn from './StacksSignIn'
import StacksSignOut from './StacksSignOut'
import StacksProfileDisplay from './StacksProfileDisplay'
import {useStacks} from '../react-hooks/useStacks';

const Stacks: FunctionComponent = () => {
  const {stacksSession} = useStacks()
  useEffect(() => {
    console.log('reload')
  }, [stacksSession])

  return (
    <div>
      <div>
        <StacksSignIn />
        <StacksSignOut />
      </div>
      <StacksProfileDisplay/>
    </div>
  );
};

export default Stacks;
