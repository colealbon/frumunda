import { FunctionComponent, useState, Fragment, useCallback } from 'react';
import { IconButton, Typography } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import useSWR, { mutate } from 'swr';
import { useStacks } from '../react-hooks/useStacks';

const StacksFileDelete: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const [deleted, setDeleted] = useState(false);
  const { fetchStacksFilenames, deleteFile } = useStacks();
  const { data: stacksFilenamesdata } = useSWR(
    'stacksFilenames',
    fetchStacksFilenames
  );
  const stacksFilenames = [stacksFilenamesdata as string[]]
    .flat(Infinity)
    .slice();

  const setDeletedCallback = useCallback(() => {
    setDeleted(true);
  }, []);

  const deleteStacksFile = () => {
    const newStacksFilenames = [stacksFilenames]
      .flat()
      .filter((stacksFilename) => stacksFilename !== props.text);
    mutate('stacksFilenames', deleteFile(props.text), {
      optimisticData: newStacksFilenames,
    });
    setDeletedCallback();
  };

  if (deleted) {
    return <Fragment key={props.text}></Fragment>;
  }

  return (
    <Typography key={props.text}>
      <IconButton
        aria-label="Delete StacksFile"
        onClick={() => deleteStacksFile()}
      >
        <DeleteOutlined />
      </IconButton>
      {`${props.text}`}
    </Typography>
  );
};

export default StacksFileDelete;
