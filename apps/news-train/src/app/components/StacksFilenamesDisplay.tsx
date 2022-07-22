import { FunctionComponent, Fragment } from 'react';
import StacksFileDelete from './StacksFileDelete';
import {Box, Typography} from '@mui/material'
import useSWR from 'swr'
import {useStacks} from '../react-hooks/useStacks'

const StacksFilenamesDisplay: FunctionComponent = () => {
  const {fetchStacksFilenames} = useStacks()
  const {data: stacksFilenamesdata } = useSWR('stacksFilenames', fetchStacksFilenames, { suspense: true })
  const stacksFilenames = [(stacksFilenamesdata as string[])].flat().slice()

  if (stacksFilenames === []) {
    return <span key='nothing'></span>
  }

  return (
    <Fragment key='stacksFilenamesDisplay'>
      <Box sx={{ maxHeight: 300, width: '100%', overflow:'auto'}}>
        <Box>
          {
          [...stacksFilenames as string[]]
          .filter(stacksFilename => stacksFilename !== '')
          .map((stacksFilename) => {
            return (
              <StacksFileDelete key={stacksFilename} text={stacksFilename} />
            )
          })
          }
        </Box>
      </Box>
      {
        [...stacksFilenames as string[]]
        .map(stacksFilename => <Typography key={`${stacksFilename}typography`} variant="caption">delete files from stacks/gaia storage (cannot be undone)</Typography>)
        .find(() => true)
      }
    </Fragment>
  )
}

export default StacksFilenamesDisplay;


