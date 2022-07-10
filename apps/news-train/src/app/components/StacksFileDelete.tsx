import React, {
  FunctionComponent
} from 'react';
import { IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { useStacks } from '../react-hooks/useStacks';

const StacksFileDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { stacksStorage }  = useStacks()

  const deleteStacksFile = () => {
    stacksStorage.deleteFile(`${props.text}`)
    .then(() => window.location.reload())
  }

  return (
    <IconButton aria-label="Delete StacksFile" onClick={deleteStacksFile}>
      <DeleteOutlined />
    </IconButton>

  );
};

export default StacksFileDelete;