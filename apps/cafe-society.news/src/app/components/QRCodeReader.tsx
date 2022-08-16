import {
  useState,
} from 'react';

import {
  Typography
} from '@mui/material'

import { QrReader } from 'react-qr-reader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortObjectByKey = (dict: any) => Object.keys(dict).sort().reduce((r, k) => Object.assign(r, { [k]: dict[k] }), {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const QRCodeReader: any = (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onComplete: any;
  }) => {
  const [accumulator, setAccumulator] = useState({});
  const [status, setStatus] = useState('')
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const setData = (value: string) => {
    if (value === 'undefined' || value === undefined)  {
      return
    }

    if (value === '')  {
      return
    }

    if (Object.values(accumulator).length === {...JSON.parse(`${value}`)}.chunkCount) {
      const newString = Object.values(sortObjectByKey(accumulator)).join('')
      const decodedText = Buffer.from(newString, 'base64').toString('ascii')
      props.onComplete(decodedText)
    }

    const valueObj = JSON.parse(`${value}`)

    if ( structuredClone(accumulator)[`${valueObj.chunkNumber}`] !== undefined) {
      return
    }

    const newAccumulator = Object.assign(accumulator)

    newAccumulator[valueObj.chunkNumber] = valueObj.content
    setStatus(`${Object.keys(newAccumulator).length} of ${valueObj.chunkCount}`)
    setAccumulator(newAccumulator)
  }

  return (
    <div>
      <QrReader
        constraints={{ facingMode: 'environment'}}
        onResult={(result, error) => {
          if (result !== undefined) {
            setData(`${JSON.parse(JSON.stringify({...result})).text}`)
          }
        }}
      />
      <Typography variant='caption' >{status}</Typography>
    </div>
  )


};

export default QRCodeReader;