import {
  FunctionComponent,
  useState,
  useEffect
} from 'react';
import {hashStr} from '../utils'
import {QRCodeSVG} from 'qrcode.react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const stringChop = (str: string, size: number) => {
  if (str == null)
     return [];
     str = String(str);
     return size > 0 ? str.match(new RegExp('.{1,' + size + '}', 'g')) : [str];
}


const QRCodeSender: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const [position, setPosition] = useState(0)
  const [payload, setPayload] = useState('')

  const data = Buffer.from(props.text).toString('base64')
  const chopped = stringChop(data, 1100)

  useEffect(() => {
    setTimeout(() => {
      const newPayload = JSON.stringify({
        hash: hashStr(data),
        chunkCount: [chopped].flat().length,
        chunkNumber: position,
        content: [chopped].flat()[position]
      }, null, 2)
      setPayload(newPayload)
      setPosition((position + 1) % [chopped].flat().length)
    }, 1100)
  }, [position, chopped, data]);



  return (
    <div>
      <div>
      <QRCodeSVG value={payload} size={300} />
      </div>
      <div>
        {`${position + 1} of ${[chopped].flat().length}`}
      </div>
    </div>
  )
};

export default QRCodeSender;