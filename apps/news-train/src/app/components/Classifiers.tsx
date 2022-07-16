import { FunctionComponent } from 'react';
import { useClassifiers } from '../react-hooks/useClassifiers'

const Classifiers: FunctionComponent = () => {
  const {classifiers} = useClassifiers()
  return (
    <pre>{JSON.stringify(classifiers, null, 2)}</pre>
  );
};

export default Classifiers;
