import React, { FunctionComponent, useContext } from 'react';
import StacksFileDelete from './StacksFileDelete';
import {StacksFilenamesContext} from './StacksFilenames'

const StacksFilenamesDisplay: FunctionComponent = () => {
  const stacksFilenamesContext = useContext(StacksFilenamesContext)
  const stacksFilenames = [...stacksFilenamesContext as string[]] 

  return (
    <>
      {
        [...stacksFilenames].map((filename: string) => {
          return (
            <div key={filename}>
              <StacksFileDelete text={filename} />
              {filename}
            </div>
          )
        })
      }
    </>
  )
}

export default StacksFilenamesDisplay;
