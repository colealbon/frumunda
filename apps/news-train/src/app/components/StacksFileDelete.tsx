import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from 'react';
import { IconButton, Typography} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { useStacks } from '../react-hooks/useStacks';
import { mutate } from 'swr';

const StacksFileDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const { deleteFile } = useStacks()
  const [deleted, setDeleted] = useState(false)

  const setDeletedCallback = useCallback(() => {
    console.log(`setDeletedCallback ${props.text}`)
    setDeleted(true)
    mutate('stacksFilenames', deleteFile(`${props.text}`))
  }, [props.text, deleteFile])

  useEffect(() => {
    //reload
  }, [deleted])

  const deleteStacksFile = () => {
    console.log(`deleteFile(${props.text})`)
    setDeletedCallback()
  }


  if (deleted) {
    return <span></span>
  }

  return (
    <Typography>
      <IconButton aria-label="Delete StacksFile" onClick={() => deleteStacksFile()}>
        <DeleteOutlined />
      </IconButton>
      {`${props.text}`}
    </Typography>
  );
};

export default StacksFileDelete;