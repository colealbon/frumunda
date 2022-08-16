import {
  FunctionComponent,
  useState,
  useCallback,
  useEffect
} from 'react';
import {hashStr} from '../utils'
import { QrReader } from 'react-qr-reader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortObjectByKey = (dict: any) => Object.keys(dict).sort().reduce((r, k) => Object.assign(r, { [k]: dict[k] }), {});

const QRCodeReader: FunctionComponent = () => {
  const [fullString, setFullString] = useState('')
  const [accumulator, setAccumulator] = useState({});
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const setDataCallback = (value: string) => {
    if (Object.values(accumulator).length === JSON.parse(value).chunkCount) {
      const newString = Object.values(sortObjectByKey(accumulator)).join('')
      const decodedText = Buffer.from(newString, 'base64').toString('ascii')
      console.log(JSON.parse(value).hash)
      console.log(hashStr(newString))
      console.log(decodedText)
      setFullString(decodedText)
    }

    const valueObj = JSON.parse(value)
    const newAccumulator = Object.assign(accumulator)
    newAccumulator[valueObj.chunkNumber] = valueObj.content
    console.log(Object.keys(newAccumulator).length)
    setAccumulator(newAccumulator)
  }

  return (
    <div>
      <QrReader
        constraints={{ facingMode: 'user'}}
        onResult={(result, error) => {
          if (result !== undefined) {
            setDataCallback(`${JSON.parse(JSON.stringify({...result})).text}`)
          }
        }}
        scanDelay={50}
      />
      <pre>
        {fullString}
      </pre>
    </div>
  )


};

export default QRCodeReader;