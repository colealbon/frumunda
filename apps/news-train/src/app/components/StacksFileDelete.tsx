import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from 'react';
import { IconButton, Typography} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { useStacks } from '../react-hooks/useStacks';

const StacksFileDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const { stacksStorage } = useStacks()
  const [deleted, setDeleted] = useState(false)

  const setDeletedCallback = useCallback(() => {
    setDeleted(true)
  }, [setDeleted])

  useEffect(() => {
    //reload
  }, [deleted])

  const deleteStacksFile = () => {
    stacksStorage.deleteFile(`${props.text}`)
    .then(() => setDeletedCallback())
  }

  if (deleted) {
    return <span></span>
  }

  return (
    <Typography>
      <IconButton aria-label="Delete StacksFile" onClick={deleteStacksFile}>
        <DeleteOutlined />
      </IconButton>
      {`${props.text}`}
    </Typography>
  );
};

export default StacksFileDelete;