import {
  FunctionComponent,
  useContext,
  useState,
  useCallback,
  ChangeEvent,
  forwardRef
} from 'react';
import useSWR, { mutate } from 'swr';
import localforage from 'localforage';
import { CategoryContext } from './Category';
import QRCodeSender from './QRCodeSender';
import QRCodeReader from './QRCodeReader';
import { 
  TextField, 
  Divider, 
  Button,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useStacks } from '../react-hooks/useStacks';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator');

// import VisibilitySensor from 'react-visibility-sensor';

const Classifier: FunctionComponent = () => {
  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;
  const [inputValue, setInputValue] = useState('');
  const filenameForClassifier = `classifier_${category}`.replace(/_$/, '');
  const { persist } = useStacks();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const snackbarAction = (
    <Alert severity="error" sx={{ width: '100%' }} >invalid classifier JSON!</Alert>
  );

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

    const setInputCallback = useCallback(
      (newInputValue: string) => {
        setInputValue(newInputValue);
      },
      [setInputValue]
    );

  let classifier = bayes();

  const [expandedQRCodeSender, setExpandedQRCodeSender] = useState<string | false>(false);
  const handleChangeQRCodeSender =
    (panel: string) => (event: React.SyntheticEvent, newExpandedQRCodeSender: boolean) => {
      setExpandedQRCodeSender(newExpandedQRCodeSender ? panel : false);
    };



  const filename = `classifier_${category}`.replace(/_$/, '')

  const { data: classifierdata } = useSWR(
    filename, 
    () => localforage.getItem(filename),
    {suspense: true}
  );

  try {
    if (classifierdata) {
      classifier = bayes.fromJson(JSON.stringify(classifierdata));
    }

  } catch (error) {
    console.log(error);
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let newClassifier = bayes();
    try {
      if (inputValue !== '') {
        newClassifier = bayes.fromJson(inputValue);
      }
    } catch (error) {
      setSnackbarOpen(true);
      return
    }

    mutate(
      filenameForClassifier,
      persist(filenameForClassifier, JSON.parse(newClassifier.toJson())),
      {
        optimisticData: newClassifier,
        rollbackOnError: false,
        revalidate: false,
        populateCache: false,
      }
    );
  }

  return (
    <>
      <Accordion 
        style={{padding: '0px'}}
        expanded={expanded === 'classifierPanel'}
        onChange={handleChange('classifierPanel')}
        TransitionProps={{ unmountOnExit: true }} 
      >
        <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
          <ListItemText sx={{ pl: 2 }} primary={`${category}`} />
        </AccordionSummary>
        <AccordionDetails>
          <Accordion 
            style={{padding: '0px'}}
            expanded={expandedQRCodeSender === 'showQRCodePanel'}
            onChange={handleChangeQRCodeSender('showQRCodePanel')}
            TransitionProps={{ unmountOnExit: true }} 

          >
            <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
              <ListItemText sx={{ pl: 2 }} primary={`show qr code`} />
            </AccordionSummary>
            <AccordionDetails style={{padding: '0px'}}>
              <QRCodeSender text={JSON.stringify(JSON.parse(classifier.toJson()), null, 2)} />
            </AccordionDetails>
          </Accordion>
          <QRCodeReader />
          <Divider />
          <div/>
          <form onSubmit={onSubmit}>
            <TextField
              id={`edit-classifier-${category}`}
              multiline
              maxRows={15}
              style={{ width: 400 }}
              defaultValue={JSON.stringify(JSON.parse(classifier.toJson()), null, 2)}
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setInputCallback(event.target.value);
              }}
            />
            <Divider />
            <Button type="submit" variant="contained">
              submit
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          invalid JSON attempted
        </Alert>

      </Snackbar>
    </>
  )
};

export default Classifier;