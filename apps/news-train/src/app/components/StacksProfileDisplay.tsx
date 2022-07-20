import { FunctionComponent } from 'react';
import {Typography} from '@mui/material';
import {useStacks} from '../react-hooks/useStacks';

const StacksProfileDisplay: FunctionComponent = () => {
  const { userSession }  = useStacks()
  return <Typography key='blockstackname'>{`${userSession.loadUserData().profile.name}`}</Typography>
};

export default StacksProfileDisplay;
