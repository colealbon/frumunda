import {
  FunctionComponent,
  useState,
  useCallback
} from 'react';
import { QrReader } from 'react-qr-reader';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText
} from '@mui/material'

const QRCodeReader: FunctionComponent = () => {

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

    const [data, setData] = useState('No result');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setDataCallback = useCallback((value: any) => {
    console.log(value)
    setData(value)
  }, [setData])

  return (
    <div>
      <Accordion 
        style={{padding: '0px'}}
        expanded={expanded === 'panel'}
        onChange={handleChange('panel')}
      >
    <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
      <ListItemText sx={{ pl: 2 }} primary={`read qr code`} />
    </AccordionSummary>
    <AccordionDetails>
    <QrReader
        constraints={{ facingMode: 'user' }}
        onResult={(result, error) => {
          console.log(result)
        }}
      />
    </AccordionDetails>
    </Accordion>
    </div>
  )


};

export default QRCodeReader;