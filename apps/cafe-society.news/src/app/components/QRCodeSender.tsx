import {
  FunctionComponent,
  useState
} from 'react';
import {hashStr} from '../utils'
import {Box} from '@mui/material'
import {QRCodeSVG} from 'qrcode.react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText
} from '@mui/material'

const QRCodeSender: FunctionComponent<{ text: string }> = (props: {
  text: string;
}) => {

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  
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
      <div>
  <Accordion 
    style={{padding: '0px'}}
    expanded={expanded === 'classifierPanel'}
    onChange={handleChange('classifierPanel')}
    TransitionProps={{ unmountOnExit: true }} 

  >
    <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
      <ListItemText sx={{ pl: 2 }} primary={`show qr code`} />
    </AccordionSummary>
    <AccordionDetails style={{padding: '0px'}}>
          <Box style={{maxWidth:400, padding: '0px'}}>
          <div />
          <Carousel 
            autoPlay={true} 
            interval={1000} 
            infiniteLoop={true} 
            showThumbs={false}
            showIndicators={false}
            showArrows={false}
          >
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

    </AccordionDetails>
    </Accordion>
    </div>
            )
    }
  return (
    <QRCodeSVG value={data} size={300} />
  )


};

export default QRCodeSender;