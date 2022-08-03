import { FunctionComponent } from 'react';
import StacksSignIn from './StacksSignIn';
import StacksSignOut from './StacksSignOut';
import StacksProfileDisplay from './StacksProfileDisplay';
import StacksFilenamesDisplay from './StacksFilenamesDisplay';

const Stacks: FunctionComponent = () => {
  return (
    <>
      <div>
        <StacksProfileDisplay />
      </div>
      <StacksSignIn />
      <StacksSignOut />
      <StacksFilenamesDisplay />
    </>
  );
};

export default Stacks;
