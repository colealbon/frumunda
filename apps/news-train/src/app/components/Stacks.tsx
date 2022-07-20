import { FunctionComponent } from 'react';
import StacksSignIn from './StacksSignIn'
import StacksSignOut from './StacksSignOut'
import StacksProfileDisplay from './StacksProfileDisplay'
import StacksFilenamesDisplay from './StacksFilenamesDisplay'
import {useStacks} from '../react-hooks/useStacks';

const Stacks: FunctionComponent = () => {
  const {userSession} = useStacks()
  return (
    <div>
      {userSession.isUserSignedIn() && <StacksProfileDisplay/>}
    </div>
  );
};

export default Stacks;
