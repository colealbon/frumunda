import React, { FunctionComponent, } from 'react';
import StacksSignIn from './StacksSignIn'
import StacksSignOut from './StacksSignOut'

const Stacks: FunctionComponent = () => {
  return (
    <>
      <StacksSignIn />
      <StacksSignOut />
    </>
  );
};

export default Stacks;
