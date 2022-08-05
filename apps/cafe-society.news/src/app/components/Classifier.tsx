import {
  FunctionComponent,
  useContext,
} from 'react';
import useSWR from 'swr';
import localforage from 'localforage';
import { CategoryContext } from './Category';
import { TextField, Divider, Button } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bayes = require('classificator');

// import VisibilitySensor from 'react-visibility-sensor';

const Classifier: FunctionComponent = () => {
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;

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
    <>
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
    <br />
  </>
  )
};

export default Classifier;