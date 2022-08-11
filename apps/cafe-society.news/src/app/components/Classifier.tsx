import {
  FunctionComponent,
  useContext,
  useState,
  Suspense
} from 'react';
import ErrorBoundary from './ErrorBoundary';
import useSWR from 'swr';
import localforage from 'localforage';
import { CategoryContext } from './Category';
import { 
  TextField, 
  Divider, 
  Button,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator');

// import VisibilitySensor from 'react-visibility-sensor';

const Classifier: FunctionComponent = () => {
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  let classifier = bayes();

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
    console.log(event)
  }

  return (
    <Accordion 
      style={{padding: '0px'}}
      expanded={expanded === 'classifierPanel'}
      onChange={handleChange('classifierPanel')}
    >
      <AccordionSummary style={{justifyContent: 'start', padding: '0px'}} >
        <ListItemText sx={{ pl: 2 }} primary={`${category}`} />
      </AccordionSummary>
          <AccordionDetails>
            <form onSubmit={onSubmit}>
              <br />
              <TextField
                id={`edit-classifier-${category}`}
                label={`edit classifier: ${category}`}
                multiline
                maxRows={4}
                style={{ width: 500 }}
                defaultValue={JSON.stringify(JSON.parse(classifier.toJson()), null, 2)}
                // onChange={event => setClassifierJSONCallback(event.target.value)}
              />
              <Divider />
              <Button type="submit" variant="contained">
                submit (disabled - under construction)
              </Button>
            </form>
          </AccordionDetails>

    </Accordion>

  )
};

export default Classifier;