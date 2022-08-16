import {
  FunctionComponent,
  useState
} from 'react';
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
      setFullString(decodedText)
      navigator.clipboard.writeText(decodedText)
    }

    const valueObj = JSON.parse(value)
    const newAccumulator = Object.assign(accumulator)
    newAccumulator[valueObj.chunkNumber] = valueObj.content
    setFullString(`${Object.keys(newAccumulator).length} of ${valueObj.chunkCount}`)
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
        scanDelay={100}

      />
      <pre>
        {fullString}
      </pre>
    </div>
  )


};

export default QRCodeReader;