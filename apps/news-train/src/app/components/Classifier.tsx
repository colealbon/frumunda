import { FunctionComponent, useContext, createContext, ReactNode} from 'react';
import { CategoryContext } from './Category'
import { useClassifiers } from '../react-hooks/useClassifiers'

export const ClassifierContext = createContext({});

type Props = {children: ReactNode}
const Classifier: FunctionComponent<Props> = ({children}: Props) => {
  const categoryContext = useContext(CategoryContext);
  const category = `${categoryContext}`;

  const {classifiers} = useClassifiers()
  
  const classifierForCategory = {...Object.entries(classifiers as object)
    .filter((classifierEntry: [string, object]) => (classifierEntry[0] === category))
    .map((classifierEntry: [string, object]) => classifierEntry[1])
    .find(() => true)}

  console.log(classifierForCategory)

  return (
    <ClassifierContext.Provider value={classifierForCategory}>
      {children}
    </ClassifierContext.Provider>
  )
}
export default Classifier;