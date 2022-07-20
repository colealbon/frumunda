import { FunctionComponent, useContext } from 'react';
import StacksFileDelete from './StacksFileDelete';
import {Box, Typography} from '@mui/material'
import useSWR from 'swr'

const StacksFilenamesDisplay: FunctionComponent = () => {

  const {data: stacksFilenames } = useSWR('stacksFilenames')

  return (
    <div>
      <Box sx={{ maxHeight: 300, width: '100%', overflow:'auto'}}>
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          }}
        >
          {
          [...stacksFilenames].map((stacksFilename) => {
            return (
              <div key={stacksFilename}>
                <StacksFileDelete text={stacksFilename} />
              </div>
            )
          })
          }
        </Box>
      </Box>
      {
        [...stacksFilenames]
        .map(() => <Typography key='caption' variant="caption">delete files from stacks/gaia storage (cannot be undone)</Typography>)
        .find(() => true)
      }
    </div>
  )
}

export default StacksFilenamesDisplay;


