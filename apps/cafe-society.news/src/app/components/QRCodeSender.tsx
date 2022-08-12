import {
  FunctionComponent
} from 'react';
import {hashStr} from '../utils'
import {Box} from '@mui/material'
import {QRCodeSVG} from 'qrcode.react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const QRCodeSender: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {
  const stringChop = (str: string, size: number) => {
    if (str == null)
       return [];
       str = String(str);
       return size > 0 ? str.match(new RegExp('.{1,' + size + '}', 'g')) : [str];
 }

  const data = Buffer.from(props.text).toString('base64')

  //const decodedText = Buffer.from(data, 'base64').toString('ascii')
  
  if (data.length > 500) {
    const chopped = stringChop(data, 500)
    return (
      <Box style={{maxWidth:400}}>
      <div />
      <Carousel autoPlay={true} interval={500} infiniteLoop={true}>
      {
      (() => {
        let count = 0
        return chopped?.map(chunk => {
          count = count + 1
          const payload = JSON.stringify({
            hash: hashStr(data),
            chunkCount: chopped.length,
            chunkNumber: count,
            content: chunk
          }, null, 2)
          return <div key={`qrCode_${count}`}><QRCodeSVG value={payload}  size={300} /></div>
        })})()
      }
      </Carousel>
      </Box>
    )
  }

  return (
    <QRCodeSVG value={data} size={300} />
  )


};

export default QRCodeSender;